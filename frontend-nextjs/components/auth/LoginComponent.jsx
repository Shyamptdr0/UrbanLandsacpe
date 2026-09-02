"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, LogIn } from "lucide-react";

const TABS = [
  {
    id: "client",
    label: "Client",
    heading: "Client Portal",
    title: "Access your project.",
    desc: "Sign in with your approved client credentials to view project status, drawings, stage updates, and payment schedules.",
    cta: "/client/register",
    ctaLabel: "Register as Client",
  },
  {
    id: "contractor",
    label: "Professional",
    heading: "Professional Portal",
    title: "Manage your business.",
    desc: "Sign in with your approved professional credentials to view assigned projects, submit material requests, upload drawings, and track payments.",
    cta: "/contractor/register",
    ctaLabel: "Register your business",
  },
];

function LoginContent({ defaultTab = "client" }) {
  const searchParams = useSearchParams();
  const queryTab = searchParams ? searchParams.get("tab") : null;
  const initialTab = (queryTab === "contractor" || queryTab === "client") ? queryTab : defaultTab;

  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (queryTab === "contractor" || queryTab === "client") {
      setTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (targetTabId) => {
    setTab(targetTabId);
    router.replace(`/login?tab=${targetTabId}`, { scroll: false });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      if (tab !== u.role) {
        toast.error(`This account is a ${u.role}. Redirecting…`);
      }
      const dest = u.role === "admin" ? "/admin" : u.role === "client" ? "/client" : "/contractor";
      toast.success("Signed in.");
      router.push(dest);
    } catch (err) { toast.error(err.response?.data?.detail || "Login failed"); }
    setBusy(false);
  };

  const active = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div className="bg-[#F4F3EF] min-h-screen">
      <Navbar />
      <section className="marketing-container py-20 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <div className="label-caps mb-6 text-terracotta">{active.heading}</div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-tighter leading-[0.95]">
            {active.id === "contractor" ? (
              <>Manage your <span className="italic font-normal">business.</span></>
            ) : (
              <>Access your <span className="italic font-normal">project.</span></>
            )}
          </h1>
          <p className="mt-6 text-neutral-600 max-w-md leading-relaxed">
            {active.desc}
          </p>
          {active.cta && (
            <Link href={active.cta} className="inline-flex items-center gap-2 mt-8 text-sm underline underline-offset-4 hover:text-terracotta">
              {active.ctaLabel} <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        <form onSubmit={submit} className="md:col-span-7 bg-white border border-stone-alt p-8 md:p-10" data-testid="login-form">
          <div className="flex gap-2 mb-8 border-b border-stone-alt">
            {TABS.map((t) => (
              <button type="button" key={t.id} onClick={() => handleTabChange(t.id)}
                data-testid={`login-tab-${t.id}`}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 -mb-px ${tab === t.id ? "border-terracotta text-terracotta" : "border-transparent text-neutral-500 hover:text-charcoal"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid gap-5">
            <F label="Email"><Input type="email" required autoComplete="email" data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)} /></F>
            <F label="Password"><Input type="password" required autoComplete="current-password" data-testid="login-password" value={password} onChange={(e) => setPassword(e.target.value)} /></F>
          </div>
          <button type="submit" disabled={busy} className="btn-terra mt-8 w-full justify-center" data-testid="login-submit">
            {busy ? "Signing in..." : "Sign In"} <LogIn size={16} />
          </button>
          <div className="mt-6 text-xs text-neutral-500 text-center">
            {tab === "admin" ? "Admin credentials are provisioned during setup." : "Not approved yet? Wait for the credentials email."}
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}

export default function LoginComponent(props) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-neutral-500">Loading portal...</div>}>
      <LoginContent {...props} />
    </Suspense>
  );
}

const F = ({ label, children }) => (<label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>);
