"""Method-level tests for drawing object-storage retry and failure mapping."""
import asyncio
import sys
from pathlib import Path

import pytest
from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


class FakeUpload:
    filename = "TEST_retry.txt"
    content_type = "text/plain"

    async def read(self):
        return b"TEST drawing retry"


def test_upload_drawing_retries_then_succeeds(monkeypatch):
    calls = []

    async def allow_project_access(project_id, user, write=False):
        assert project_id == "TEST-project"
        assert write is True

    def flaky_put(path, data, content_type):
        calls.append((path, data, content_type))
        if len(calls) < 3:
            raise RuntimeError("TEST transient storage failure")
        return {"path": path, "size": len(data)}

    async def record_insert(document):
        document["_id"] = "TEST-mongo-id"

    monkeypatch.setattr(server, "assert_project_access", allow_project_access)
    monkeypatch.setattr(server, "put_object", flaky_put)
    monkeypatch.setattr(server.db.drawings, "insert_one", record_insert)

    result = asyncio.run(server.upload_drawing(
        project_id="TEST-project",
        category="Other",
        file=FakeUpload(),
        user={"id": "TEST-admin", "role": "admin"},
    ))

    assert len(calls) == 3
    assert result["storage_path"].startswith(f"{server.APP_NAME}/drawings/TEST-project/")
    assert result["size"] == len(b"TEST drawing retry")
    assert "_id" not in result


def test_upload_drawing_returns_502_after_three_failures(monkeypatch):
    calls = 0

    async def allow_project_access(project_id, user, write=False):
        return None

    def failing_put(path, data, content_type):
        nonlocal calls
        calls += 1
        raise RuntimeError(f"TEST storage failure {calls}")

    monkeypatch.setattr(server, "assert_project_access", allow_project_access)
    monkeypatch.setattr(server, "put_object", failing_put)

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(server.upload_drawing(
            project_id="TEST-project",
            category="Other",
            file=FakeUpload(),
            user={"id": "TEST-admin", "role": "admin"},
        ))

    assert calls == 3
    assert exc_info.value.status_code == 502
    assert "Storage upload failed" in exc_info.value.detail
    assert "TEST storage failure 3" in exc_info.value.detail
