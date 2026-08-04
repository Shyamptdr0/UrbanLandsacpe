"use client";
import { useState } from "react";
import { Download, FileArchive, FileText, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api, { API_BASE } from "@/lib/api";

const INCLUDES = [
  { icon: FileArchive, t: "Complete Source Code", d: "Backend (FastAPI + MongoDB) and Frontend (React + Tailwind + shadcn/ui)." },
  { icon: FileText, t: "Environment Files", d: "Pre-configured backend/.env and frontend/.env with the keys used in the demo." },
  { icon: FileText, t: "README.md", d: "Step-by-step setup, prerequisites, admin login and deployment notes." },
];

export default function DownloadSection() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Enter name and email.");
    setBusy(true);
    try {
      const { data } = await api.post("/download/request", form);
      const url = `${API_BASE}/download/project?token=${encodeURIComponent(data.token)}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "urban-landscape.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDone(true);
      toast.success("Building ZIP — download will start shortly.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate download.");
    }
    setBusy(false);
  };

  return (
    <section id="download" data-testid="download-section" className="bg-[#EAE7DF] border-y border-stone-alt">
      <div className="marketing-container py-24 md:py-32 grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="label-caps mb-6 text-terracotta">Source Access</div>
          <h2 className="font-heading text-5xl md:text-6xl tracking-tighter leading-[0.95]">
            Take the whole <span className="italic font-normal">codebase</span> home.
          </h2>
          <p className="mt-6 text-neutral-700 max-w-md leading-relaxed">
            Download a fresh ZIP of the full Urban Landscape project — backend, frontend, environment files and a step-by-step README so you can run it on your own machine.
          </p>
          <div className="mt-10 space-y-4">
            {INCLUDES.map((i) => (
              <div key={i.t} className="flex items-start gap-4 border-t border-stone-alt pt-4">
                <i.icon size={18} className="text-terracotta mt-0.5 shrink-0" />
                <div>
                  <div className="font-heading text-lg tracking-tight">{i.t}</div>
                  <div className="text-sm text-neutral-600">{i.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="md:col-span-7 bg-white border border-stone-alt p-8 md:p-10 h-fit" data-testid="download-form">
          <div className="label-caps mb-2">Instant Access</div>
          <div className="font-heading text-3xl tracking-tight">Download Project ZIP</div>
          <p className="text-sm text-neutral-600 mt-2">Tell us who you are — the archive builds on-demand and starts downloading immediately.</p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <F label="Your Name">
              <Input required data-testid="download-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aditi Sharma" />
            </F>
            <F label="Email">
              <Input required type="email" data-testid="download-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </F>
          </div>

          <button type="submit" disabled={busy} className="btn-terra mt-8 w-full justify-center" data-testid="download-submit">
            {busy ? "Building ZIP…" : done ? "Download Again" : "Download ZIP"}
            {done ? <CheckCircle2 size={16} /> : <Download size={16} />}
          </button>

          <div className="mt-6 grid md:grid-cols-3 gap-3 text-center">
            <MiniStat label="Backend" value="FastAPI" />
            <MiniStat label="Frontend" value="Next.js 16" />
            <MiniStat label="Bundle" value="~1.5 MB" />
          </div>

          <div className="mt-6 flex items-start gap-2 text-xs text-neutral-500 border-t border-stone-alt pt-4">
            <ArrowUpRight size={12} className="mt-0.5 shrink-0" />
            <span>By downloading you agree to use the code for personal or evaluation purposes. Change <code className="marker-num">JWT_SECRET</code> and <code className="marker-num">ADMIN_PASSWORD</code> before production.</span>
          </div>
        </form>
      </div>
    </section>
  );
}

const F = ({ label, children }) => (
  <label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>
);

const MiniStat = ({ label, value }) => (
  <div className="border border-stone-alt bg-[#F4F3EF] p-3">
    <div className="label-caps text-neutral-500">{label}</div>
    <div className="font-heading text-base mt-1 tracking-tight">{value}</div>
  </div>
);
