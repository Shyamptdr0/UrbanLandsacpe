"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function DashboardShell({ nav, title, children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-charcoal grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-stone-alt bg-white md:sticky md:top-0 md:h-screen flex flex-col">
        <Link href="/" className="flex items-center gap-3 px-5 h-16 border-b border-stone-alt" data-testid="ds-brand">
          <div className="w-6 h-6 border border-charcoal grid place-items-center"><div className="w-1.5 h-1.5 bg-terracotta" /></div>
          <span className="font-heading tracking-tight text-[15px] font-medium">Urban Landscape</span>
        </Link>
        <div className="px-5 py-4 border-b border-stone-alt">
          <div className="label-caps">{title}</div>
          <div className="mt-1 text-sm font-medium">{user?.full_name}</div>
          <div className="text-xs text-neutral-500 marker-num">{user?.user_code}</div>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          {nav.map((n) => {
            const isActive = n.end ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                href={n.to}
                data-testid={`ds-nav-${n.key}`}
                className={
                  `flex items-center gap-3 mx-3 px-3 py-2 text-sm rounded-sm ${isActive ? "bg-charcoal text-stone" : "text-neutral-600 hover:bg-stone-alt"}`
                }
              >
                <n.icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} data-testid="ds-logout" className="m-3 mt-0 flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-terracotta">
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}

export const StatCard = ({ label, value, sub, tone = "default", "data-testid": tid }) => {
  const tones = {
    default: "bg-white",
    dark: "bg-charcoal text-stone border-charcoal",
    accent: "bg-terracotta text-white border-terracotta",
  };
  return (
    <div className={`p-5 border border-stone-alt ${tones[tone]}`} data-testid={tid}>
      <div className={`text-[10px] uppercase tracking-[0.24em] ${tone === "default" ? "text-neutral-500" : "text-white/70"}`}>{label}</div>
      <div className="font-heading text-3xl mt-3 tracking-tight">{value}</div>
      {sub && <div className={`text-xs mt-2 ${tone === "default" ? "text-neutral-500" : "text-white/60"}`}>{sub}</div>}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    Pending: "bg-amber-50 text-amber-800 border-amber-200",
    Open: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    Rejected: "bg-red-50 text-red-800 border-red-200",
    Overdue: "bg-red-50 text-red-800 border-red-200",
    "In Progress": "bg-blue-50 text-blue-800 border-blue-200",
    "Not Started": "bg-neutral-100 text-neutral-700 border-neutral-200",
    New: "bg-blue-50 text-blue-800 border-blue-200",
  };
  const cls = map[status] || "bg-neutral-100 text-neutral-700 border-neutral-200";
  return <span className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 border ${cls}`}>{status}</span>;
};

export const PageHead = ({ title, subtitle, actions }) => (
  <div className="border-b border-stone-alt bg-white px-6 md:px-10 py-6 flex items-center justify-between gap-4">
    <div>
      <div className="label-caps text-neutral-500">{subtitle}</div>
      <h1 className="font-heading text-2xl md:text-3xl mt-1 tracking-tight">{title}</h1>
    </div>
    <div className="flex gap-2">{actions}</div>
  </div>
);
