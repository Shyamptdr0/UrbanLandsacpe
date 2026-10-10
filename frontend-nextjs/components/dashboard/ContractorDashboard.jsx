"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Image, ListChecks, PackageOpen, Wallet, MessageSquareText, User, Send, Plus, Upload, Check } from "lucide-react";
import DashboardShell, { StatCard, StatusBadge, PageHead } from "@/components/dashboard/DashboardShell";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const NAV = [
  { key: "home", to: "/contractor", end: true, label: "Home", icon: Home },
  { key: "projects", to: "/contractor/projects", label: "Active Projects", icon: Building2 },
  { key: "drawings", to: "/contractor/drawings", label: "Drawings", icon: Image },
  { key: "stages", to: "/contractor/stages", label: "Stage", icon: ListChecks },
  { key: "materials", to: "/contractor/materials", label: "Material", icon: PackageOpen },
  { key: "payments", to: "/contractor/payments", label: "Payment", icon: Wallet },
  { key: "queries", to: "/contractor/queries", label: "Queries", icon: MessageSquareText },
  { key: "profile", to: "/contractor/profile", label: "Profile", icon: User },
];

const fmt = (n) => "₹ " + (Number(n) || 0).toLocaleString("en-IN");

export default function ContractorDashboard() {
  const pathname = usePathname();
  let content = <CHome />;
  if (pathname.includes("/contractor/projects")) content = <CProjects />;
  else if (pathname.includes("/contractor/drawings")) content = <CDrawings />;
  else if (pathname.includes("/contractor/stages")) content = <CStages />;
  else if (pathname.includes("/contractor/materials")) content = <CMaterials />;
  else if (pathname.includes("/contractor/payments")) content = <CPayments />;
  else if (pathname.includes("/contractor/queries")) content = <CQueries />;
  else if (pathname.includes("/contractor/profile")) content = <CProfile />;

  return (
    <DashboardShell nav={NAV} title="Professional Portal">
      {content}
    </DashboardShell>
  );
}

function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = sessionStorage.getItem("ul_ctr_projects");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(!projects.length);

  useEffect(() => {
    api.get("/projects")
      .then(({ data }) => {
        setProjects(data);
        try {
          sessionStorage.setItem("ul_ctr_projects", JSON.stringify(data));
        } catch (e) {}
      })
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}

function ProjectPicker({ value, onChange }) {
  const { projects } = useProjects();

  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger data-testid="ctr-proj-picker" className="w-72 bg-white">
        <SelectValue placeholder="Select Project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CHome() {
  const [s, setS] = useState(null);
  const { projects, loading } = useProjects();
  useEffect(() => { api.get("/contractor/stats").then(({ data }) => setS(data)); }, []);
  return (
    <>
      <PageHead subtitle="Professional" title="Overview" />
      <div className="p-6 md:p-10 space-y-8">
        {!s ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-stone-alt p-5 animate-pulse space-y-3">
                <div className="h-3 bg-stone-200 rounded w-24" />
                <div className="h-8 bg-stone-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Active Projects" value={s?.active_projects ?? "—"} tone="dark" />
            <StatCard label="Completed" value={s?.completed_projects ?? "—"} />
            <StatCard label="Total Agreed" value={fmt(s?.total_amount)} />
            <StatCard label="Received" value={fmt(s?.received)} tone="accent" />
          </div>
        )}

        <div className="bg-white border border-stone-alt">
          <div className="p-5 border-b border-stone-alt font-heading text-xl tracking-tight">Recent Projects</div>
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-44" />
                    <div className="h-3 bg-stone-100 rounded w-28" />
                  </div>
                  <div className="h-6 bg-stone-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-stone-alt">
              {projects.slice(0, 3).map((p) => (
                <div key={p.id} className="p-5 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-neutral-500">{p.client?.full_name || p.project_type}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
              {projects.length === 0 && <div className="p-5 text-sm text-neutral-500">No projects assigned yet.</div>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CProjects() {
  const { projects, loading } = useProjects();
  return (
    <>
      <PageHead subtitle="Projects" title="Assigned Projects" />
      <div className="p-6 md:p-10 grid md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-stone-alt p-6 animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-stone-200 rounded w-28" />
                <div className="h-5 bg-stone-200 rounded w-20" />
              </div>
              <div className="h-7 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div><div className="h-3 bg-stone-200 rounded w-16 mb-1" /><div className="h-4 bg-stone-100 rounded w-24" /></div>
                <div><div className="h-3 bg-stone-200 rounded w-16 mb-1" /><div className="h-4 bg-stone-100 rounded w-24" /></div>
                <div><div className="h-3 bg-stone-200 rounded w-16 mb-1" /><div className="h-4 bg-stone-100 rounded w-24" /></div>
                <div><div className="h-3 bg-stone-200 rounded w-16 mb-1" /><div className="h-4 bg-stone-100 rounded w-24" /></div>
              </div>
            </div>
          ))
        ) : (
          projects.map((p) => (
            <div key={p.id} className="bg-white border border-stone-alt p-6">
              <div className="flex items-center justify-between"><div className="label-caps">{p.project_type}</div><StatusBadge status={p.status} /></div>
              <div className="font-heading text-2xl mt-2 tracking-tight">{p.title}</div>
              <div className="text-sm text-neutral-600 mt-2">Client: {p.client?.full_name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><div className="label-caps">Amount</div><div className="marker-num">{fmt(p.total_amount)}</div></div>
                <div><div className="label-caps">Rate (sq ft)</div><div>{p.rate ? `₹${p.rate}/sq ft` : "—"}</div></div>
                <div><div className="label-caps">Start</div><div>{p.start_date || "—"}</div></div>
                <div><div className="label-caps">End</div><div>{p.end_date || "—"}</div></div>
              </div>
            </div>
          ))
        )}
        {!loading && projects.length === 0 && <div className="text-sm text-neutral-500">No projects assigned yet.</div>}
      </div>
    </>
  );
}

function DrawingThumbnail({ src, alt, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-12 h-12 rounded border border-stone-alt overflow-hidden bg-stone-100 flex items-center justify-center cursor-pointer hover:opacity-85 transition-opacity"
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <div className="text-[10px] font-bold text-neutral-400">IMG</div>
      )}
    </div>
  );
}

function CDrawings() {
  const [pid, setPid] = useState("");
  const [projects, setProjects] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setProjects(data));
  }, []);

  const load = useCallback(() => {
    if (pid) {
      setLoading(true);
      api
        .get("/drawings", { params: { project_id: pid } })
        .then(({ data }) => setRows(data))
        .finally(() => setLoading(false));
    }
  }, [pid]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedProject = projects.find((p) => p.id === pid);

  const getImageUrl = (d) => {
    const token = localStorage.getItem("ul_token");
    return `${api.defaults.baseURL}/drawings/${d.id}/download?auth=${token}`;
  };

  return (
    <>
      <PageHead subtitle="Drawings" title="View Blueprints & Photos" actions={<ProjectPicker value={pid} onChange={setPid} />} />
      <div className="p-6 md:p-10 space-y-6">
        {pid && selectedProject && (
          <>
            {/* Project Details Card */}
            <div className="bg-white border border-stone-alt p-6 flex flex-wrap justify-between gap-6 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-charcoal">Client ID:</span>{" "}
                  <span className="marker-num text-neutral-600 font-medium">{selectedProject.client?.user_code || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-charcoal">AEC Professional ID:</span>{" "}
                  <span className="marker-num text-neutral-600 font-medium">{selectedProject.contractor?.user_code || "—"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-charcoal">Client Name:</span>{" "}
                  <span className="text-neutral-700">{selectedProject.client?.full_name || "—"}</span>
                </div>
                <div>
                  <span className="font-semibold text-charcoal">AEC Professional Name:</span>{" "}
                  <span className="text-neutral-700">{selectedProject.contractor?.full_name || "—"}</span>
                </div>
              </div>
            </div>

            {/* Drawings Table Card */}
            <div className="bg-white border border-stone-alt p-6">
              <div className="font-heading text-xl font-medium text-charcoal mb-4">Drawings & Photos</div>

              <div className="overflow-x-auto border border-stone-alt rounded-sm">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9F8F6] border-b border-stone-alt text-xs font-semibold text-neutral-600">
                    <tr>
                      <th className="text-left p-3 w-20">Preview</th>
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3 w-48">Date</th>
                      <th className="text-right p-3 pr-6 w-32">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3, 4].map((i) => (
                        <tr key={i} className="animate-pulse border-t border-stone-alt">
                          <td className="p-3">
                            <div className="w-12 h-12 bg-stone-200 rounded animate-pulse" />
                          </td>
                          <td className="p-3">
                            <div className="h-4 bg-stone-200 rounded w-48 mb-2 animate-pulse" />
                            <div className="h-3 bg-stone-100 rounded w-24 animate-pulse" />
                          </td>
                          <td className="p-3">
                            <div className="h-3 bg-stone-200 rounded w-32 animate-pulse" />
                          </td>
                          <td className="p-3 text-right">
                            <div className="h-7 bg-stone-200 rounded w-20 ml-auto animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      rows.map((d) => (
                        <tr key={d.id} className="border-t border-stone-alt hover:bg-[#FDFDFD]">
                          <td className="p-3">
                            {d.content_type?.startsWith("image/") ? (
                              <DrawingThumbnail
                                src={getImageUrl(d)}
                                alt={d.original_filename}
                                onClick={() => setViewingImage(d)}
                              />
                            ) : (
                              <div
                                onClick={() => window.open(getImageUrl(d), "_blank")}
                                className="w-12 h-12 bg-stone-100 border border-stone-alt rounded flex items-center justify-center text-[10px] font-bold text-neutral-500 cursor-pointer">
                                FILE
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-medium text-charcoal truncate max-w-xs">{d.original_filename}</td>
                          <td className="p-3 text-neutral-500 marker-num text-xs">
                            {d.uploaded_at ? new Date(d.uploaded_at).toLocaleString() : "—"}
                          </td>
                          <td className="p-3 text-right pr-6 space-x-2 whitespace-nowrap">
                            {d.content_type?.startsWith("image/") && (
                              <button
                                onClick={() => setViewingImage(d)}
                                className="px-3 py-1 bg-white border border-stone-alt text-xs font-medium rounded-sm hover:border-neutral-400">
                                View
                              </button>
                            )}
                            <a
                              href={getImageUrl(d)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-white border border-stone-alt text-xs font-medium rounded-sm hover:border-neutral-400 inline-block">
                              Open
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-neutral-500">
                          No drawings available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!pid && (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project to view drawings.
          </div>
        )}
      </div>

      {/* High-Resolution Image Lightbox Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(o) => !o && setViewingImage(null)}>
        <DialogContent className="max-w-4xl bg-white border border-stone-alt shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl truncate">{viewingImage?.original_filename}</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="space-y-4 mt-2">
              <div className="max-h-[75vh] overflow-auto flex justify-center bg-[#F4F3EF] p-4 border border-stone-alt rounded-sm">
                <img src={getImageUrl(viewingImage)} alt={viewingImage.original_filename} className="max-w-full h-auto object-contain rounded" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-stone-alt">
                <a href={getImageUrl(viewingImage)} target="_blank" rel="noreferrer" className="btn-terra">
                  Full Resolution / Download
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function CStages() {
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [addingStageCat, setAddingStageCat] = useState(null);
  const [form, setForm] = useState({ stage_name: "", description: "", status: "Not Started" });

  const load = useCallback(() => { if (pid) api.get("/stages", { params: { project_id: pid } }).then(({ data }) => setRows(data)); }, [pid]);
  useEffect(() => { load(); }, [load]);

  const add = async (catName) => {
    if (!pid || !form.stage_name.trim()) return toast.error("Enter stage name");
    await api.post("/stages", {
      ...form,
      stage_name: form.stage_name.trim(),
      project_id: pid,
      category: catName || "General",
      order_index: rows.length,
    });
    toast.success("Stage added");
    setForm({ stage_name: "", description: "", status: "Not Started" });
    setAddingStageCat(null);
    load();
  };

  const upd = async (s, status) => {
    if (status === "Completed") {
      toast.info("Submitted for Admin Approval");
    }
    await api.put(`/stages/${s.id}`, { ...s, status, project_id: pid });
    load();
  };

  const uncheckByContractor = async (s) => {
    const reason = prompt("Enter reason for unchecking (e.g., Marked completed by mistake):");
    if (reason === null) return; // user cancelled
    await api.put(`/stages/${s.id}`, {
      ...s,
      status: "In Progress",
      admin_remarks: reason.trim() ? `Contractor Note: ${reason.trim()}` : "",
      project_id: pid,
    });
    toast.success("Stage status reverted to In Progress");
    load();
  };

  const categories = Array.from(new Set(rows.map((r) => r.category || "General"))).filter(Boolean);

  return (
    <>
      <PageHead subtitle="Stages" title="Update Progress" actions={<ProjectPicker value={pid} onChange={setPid} />} />
      <div className="p-6 md:p-10 space-y-6">
        {categories.map((catName) => {
          const catStages = rows.filter((r) => (r.category || "General") === catName);
          return (
            <div key={catName} className="bg-white border border-stone-alt rounded-sm overflow-hidden shadow-sm">
              <div className="bg-[#F9F8F6] border-b border-stone-alt p-4 font-heading text-base font-semibold text-charcoal flex items-center justify-between">
                <span>{catName}</span>
                <span className="text-xs font-normal text-neutral-500 bg-white border border-stone-alt px-2.5 py-0.5 rounded-full">
                  {catStages.length} Stages
                </span>
              </div>
              <div className="p-4 space-y-3">
                {catStages.map((s, i) => {
                  const isCompleted = s.status === "Completed";
                  return (
                    <div
                      key={s.id}
                      className={`p-4 rounded-sm flex flex-wrap items-center justify-between gap-4 border transition-colors ${
                        isCompleted
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-[#FDFDFD] border-stone-alt"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[240px] flex-1">
                        <div className="marker-num text-terracotta font-semibold text-sm w-7">#{i + 1}</div>
                        <div>
                          <div className="font-heading text-base font-semibold text-charcoal flex items-center gap-2">
                            <span>{s.stage_name}</span>
                            {isCompleted && (
                              <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1">
                                <Check size={12} /> Completed & Verified
                              </span>
                            )}
                            {s.status === "Pending Approval" && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                                Pending Admin Approval
                              </span>
                            )}
                          </div>
                          {s.description && <div className="text-xs text-neutral-500 mt-0.5">{s.description}</div>}
                          {s.admin_remarks && (
                            <div className="mt-1 text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded border border-red-100 inline-block">
                              Admin Unchecked Remark: {s.admin_remarks}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-sm inline-flex items-center gap-1.5 shadow-xs">
                            <Check size={14} /> Completed
                          </span>
                        ) : (
                          <>
                            <Select value={s.status} onValueChange={(v) => upd(s, v)}>
                              <SelectTrigger className="w-40 h-8 text-xs bg-white" data-testid={`ctr-stage-status-${s.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Not Started" className="text-xs">Not Started</SelectItem>
                                <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                                <SelectItem value="Completed" className="text-xs">Submit for Completion</SelectItem>
                                <SelectItem value="Pending Approval" className="text-xs">Pending Approval</SelectItem>
                              </SelectContent>
                            </Select>

                            {s.status === "Pending Approval" && (
                              <button
                                onClick={() => uncheckByContractor(s)}
                                className="px-2.5 py-1 border border-stone-alt text-neutral-600 hover:bg-stone-100 text-xs font-medium rounded-sm"
                                title="Uncheck if marked completed by mistake"
                              >
                                Uncheck
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {pid && rows.length === 0 && (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            No project stages found for this project.
          </div>
        )}
        {!pid && (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project from the dropdown above to view or update stages.
          </div>
        )}
      </div>
    </>
  );
}

function CMaterials() {
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ material_name: "", quantity: 0, unit: "kg", notes: "" });

  const load = useCallback(() => {
    if (pid) {
      api.get("/materials", { params: { project_id: pid } }).then(({ data }) => setRows(data));
    } else {
      setRows([]);
    }
  }, [pid]);

  useEffect(() => { load(); }, [load]);

  const req = async () => {
    if (!pid || !form.material_name) return toast.error("Select project and material");
    await api.post("/materials", { ...form, project_id: pid, quantity: Number(form.quantity) });
    setForm({ material_name: "", quantity: 0, unit: "kg", notes: "" });
    load();
    toast.success("Request submitted");
  };

  return (
    <>
      <PageHead subtitle="Materials" title="Requests" actions={<ProjectPicker value={pid} onChange={setPid} />} />
      <div className="p-6 md:p-10 space-y-6">
        {pid ? (
          <>
            <div className="bg-white border border-stone-alt p-5 grid md:grid-cols-[1fr_120px_120px_1fr_120px] gap-3 items-end">
              <F label="Material"><Input value={form.material_name} onChange={(e) => setForm({ ...form, material_name: e.target.value })} data-testid="ctr-mat-name" /></F>
              <F label="Qty"><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} data-testid="ctr-mat-qty" /></F>
              <F label="Unit"><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></F>
              <F label="Notes"><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></F>
              <button onClick={req} className="btn-terra justify-center" data-testid="ctr-mat-submit"><Plus size={14} /> Request</button>
            </div>
            <div className="bg-white border border-stone-alt overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-alt text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left p-3">Material</th>
                    <th className="text-left p-3">Qty</th>
                    <th className="text-left p-3">Unit</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.id} className="border-t border-stone-alt">
                      <td className="p-3 font-medium">{m.material_name}</td>
                      <td className="p-3 marker-num">{m.quantity}</td>
                      <td className="p-3">{m.unit}</td>
                      <td className="p-3"><StatusBadge status={m.status} /></td>
                      <td className="p-3 text-xs text-neutral-500">{m.admin_remarks || "—"}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-neutral-500">
                        No material requests found for this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project from the dropdown above to view or request materials.
          </div>
        )}
      </div>
    </>
  );
}

function CPayments() {
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);

  const load = useCallback(() => {
    if (pid) {
      api.get("/payments", { params: { project_id: pid } }).then(({ data }) => {
        setRows(data.filter((p) => p.direction === "paid_to_contractor"));
      });
    } else {
      setRows([]);
    }
  }, [pid]);

  useEffect(() => {
    load();
  }, [load]);

  const recv = rows.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const pend = rows.filter((r) => r.status !== "Paid").reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <PageHead subtitle="Payments" title="Installments" actions={<ProjectPicker value={pid} onChange={setPid} />} />
      <div className="p-6 md:p-10 space-y-6">
        {pid ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Received" value={fmt(recv)} tone="dark" />
              <StatCard label="Pending" value={fmt(pend)} tone="accent" />
              <StatCard label="Installments" value={rows.length} />
            </div>
            <div className="bg-white border border-stone-alt overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-alt text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left p-3">#</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Due</th>
                    <th className="text-left p-3">Paid Date</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p, idx) => (
                    <tr key={p.id} className="border-t border-stone-alt">
                      <td className="p-3 marker-num">#{idx + 1}</td>
                      <td className="p-3 marker-num">{fmt(p.amount)}</td>
                      <td className="p-3">{p.due_date?.slice(0, 10) || "—"}</td>
                      <td className="p-3">{p.paid_date?.slice(0, 10) || "—"}</td>
                      <td className="p-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-neutral-500">
                        No payment records found for this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white border border-stone-alt p-8 text-center text-neutral-500">
            Select a project from the dropdown above to view AEC professional payment details.
          </div>
        )}
      </div>
    </>
  );
}

function CQueries() {
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const load = useCallback(() => { const q = pid ? { project_id: pid } : {}; api.get("/queries", { params: q }).then(({ data }) => setRows(data)); }, [pid]);
  useEffect(() => { load(); }, [load]);
  const send = async () => {
    if (!pid || !form.subject) return toast.error("Select project and subject");
    await api.post("/queries", { project_id: pid, ...form });
    setForm({ subject: "", message: "" }); load(); toast.success("Query raised");
  };
  return (
    <>
      <PageHead subtitle="Queries" title="Support" actions={<ProjectPicker value={pid} onChange={setPid} />} />
      <div className="p-6 md:p-10 space-y-6">
        <div className="bg-white border border-stone-alt p-5 space-y-3">
          <F label="Subject"><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} data-testid="ctr-q-subject" /></F>
          <F label="Message"><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="ctr-q-msg" /></F>
          <button onClick={send} className="btn-terra" data-testid="ctr-q-send"><Send size={14} /> Raise Query</button>
        </div>
        <div className="space-y-3">
          {rows.map((q) => (
            <div key={q.id} className="bg-white border border-stone-alt p-5">
              <div className="flex items-center justify-between"><div className="font-heading text-lg tracking-tight">{q.subject}</div><StatusBadge status={q.status} /></div>
              <div className="text-sm mt-3 text-neutral-700">{q.message}</div>
              {q.response && <div className="text-sm mt-3 border-l-2 border-terracotta pl-3"><span className="label-caps text-terracotta">Admin</span><div className="mt-1">{q.response}</div></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CProfile() {
  const { user, refresh } = useAuth();
  const [pw, setPw] = useState({ old_password: "", new_password: "" });
  const change = async () => { try { await api.post("/auth/change-password", pw); toast.success("Password changed"); setPw({ old_password: "", new_password: "" }); refresh(); } catch (e) { toast.error(e.response?.data?.detail || "Failed"); } };
  return (
    <>
      <PageHead subtitle="Profile" title="Account" />
      <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-alt p-6">
          <div className="font-heading text-xl">Business</div>
          <div className="mt-4 grid gap-3 text-sm">
            <Row label="Name" value={user?.full_name} />
            <Row label="Business" value={user?.business_name} />
            <Row label="Category" value={user?.category} />
            <Row label="Email" value={user?.email} />
            <Row label="Phone" value={user?.phone} />
            <Row label="User Code" value={user?.user_code} />
          </div>
        </div>
        <div className="bg-white border border-stone-alt p-6">
          <div className="font-heading text-xl">Change Password</div>
          <div className="mt-4 grid gap-3">
            <F label="Old Password"><Input type="password" value={pw.old_password} onChange={(e) => setPw({ ...pw, old_password: e.target.value })} /></F>
            <F label="New Password"><Input type="password" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} /></F>
            <button onClick={change} className="btn-terra" data-testid="ctr-pw-change">Update</button>
          </div>
        </div>
      </div>
    </>
  );
}

const F = ({ label, children }) => (<label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>);
const Row = ({ label, value }) => (<div className="flex items-center justify-between border-b border-stone-alt py-2"><div className="label-caps">{label}</div><div className="marker-num">{value || "—"}</div></div>);
