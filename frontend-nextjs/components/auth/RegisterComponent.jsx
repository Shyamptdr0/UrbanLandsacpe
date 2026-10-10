"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/api";

const TABS = [
  {
    id: "client",
    label: "Client",
    heading: "Client Registration",
    title: "Start your project.",
    desc: "Register as a client to compare quotes from certified architects, engineers, interior designers, and contractors with escrow-protected milestones.",
    loginUrl: "/login?tab=client",
    loginLabel: "Already registered? Client Login",
  },
  {
    id: "contractor",
    label: "AEC Professionals",
    heading: "AEC Professionals Registration",
    title: "Register your business.",
    desc: "Join our vetted network of construction professionals. Get matched with high-intent homeowners and enjoy guaranteed milestone disbursements with zero commission cuts.",
    loginUrl: "/login?tab=contractor",
    loginLabel: "Already registered? AEC Professionals Login",
  },
];

function RegisterContent({ defaultTab = "client" }) {
  const searchParams = useSearchParams();
  const queryTab = searchParams ? searchParams.get("tab") : null;
  const initialTab = queryTab === "contractor" || queryTab === "client" ? queryTab : defaultTab;

  const [tab, setTab] = useState(initialTab);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Client form state
  const [clientForm, setClientForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    budget: "",
  });

  // Contractor form state
  const [contractorForm, setContractorForm] = useState({
    full_name: "",
    business_name: "",
    email: "",
    phone: "",
    city: "",
    experience_years: "",
    address: "",
  });

  useEffect(() => {
    if (queryTab === "contractor" || queryTab === "client") {
      setTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (targetTabId) => {
    setTab(targetTabId);
    if (targetTabId === "client") {
      router.replace("/client/register", { scroll: false });
    } else {
      router.replace("/contractor/register", { scroll: false });
    }
  };

  const submitClient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/register/client", clientForm);
      toast.success("Application received! Credentials will be sent on approval.");
      setTimeout(() => router.push("/login?tab=client"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed. Please check your information.");
    }
    setSubmitting(false);
  };

  const submitContractor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/register/contractor", {
        ...contractorForm,
        experience_years: Number(contractorForm.experience_years) || 0,
        portfolio_urls: [],
      });
      toast.success("Application received! Credentials will be sent on approval.");
      setTimeout(() => router.push("/login?tab=contractor"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed. Please check your details.");
    }
    setSubmitting(false);
  };

  const active = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div className="bg-[#F4F3EF] min-h-screen flex flex-col font-sans selection:bg-[#053c63] selection:text-white">
      <Navbar />

      <section className="marketing-container py-16 md:py-20 grid md:grid-cols-12 gap-12 lg:gap-16 flex-1 items-start">
        {/* Left Column (matching Login page layout) */}
        <div className="md:col-span-5 space-y-4">
          <div className="label-caps text-[#053c63] font-bold tracking-[0.2em] uppercase text-xs">
            {active.heading}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[0.95] text-[#1A1A1A]">
            {active.id === "contractor" ? (
              <>
                Register your <span className="italic font-normal text-[#053c63]">business.</span>
              </>
            ) : (
              <>
                Start your <span className="italic font-normal text-[#053c63]">project.</span>
              </>
            )}
          </h1>

          <p className="mt-6 text-neutral-600 max-w-md leading-relaxed text-sm md:text-base font-light">
            {active.desc}
          </p>

          <div className="pt-4">
            <Link
              href={active.loginUrl}
              className="inline-flex items-center gap-2 text-sm text-[#053c63] underline underline-offset-4 hover:text-[#074b7a] font-medium"
            >
              {active.loginLabel} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column (matching Login page form card) */}
        <div
          className="md:col-span-7 bg-white border border-stone-alt p-7 sm:p-10 shadow-xs"
          data-testid="register-card"
        >
          {/* Tabs header matching Login page */}
          <div className="flex gap-4 mb-8 border-b border-stone-alt">
            {TABS.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                data-testid={`register-tab-${t.id}`}
                className={`px-4 py-3 text-xs uppercase tracking-[0.2em] border-b-2 -mb-px font-semibold transition-colors cursor-pointer ${
                  tab === t.id
                    ? "border-[#053c63] text-[#053c63]"
                    : "border-transparent text-neutral-500 hover:text-charcoal"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* CLIENT FORM */}
          {tab === "client" ? (
            <form onSubmit={submitClient} className="space-y-4" data-testid="client-register-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Full Name *">
                  <Input
                    required
                    data-testid="rc-name"
                    placeholder="e.g. Rahul Sharma"
                    value={clientForm.full_name}
                    onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                  />
                </F>
                <F label="Phone Number *">
                  <Input
                    required
                    type="tel"
                    data-testid="rc-phone"
                    placeholder="+91 98276 00000"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  />
                </F>
              </div>

              <F label="Email Address *">
                <Input
                  required
                  type="email"
                  data-testid="rc-email"
                  placeholder="rahul@example.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                />
              </F>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="City *">
                  <Input
                    required
                    data-testid="rc-city"
                    placeholder="e.g. Indore, Bhopal, Pune"
                    value={clientForm.city}
                    onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                  />
                </F>
                <F label="Approx. Budget (Optional)">
                  <Input
                    data-testid="rc-budget"
                    placeholder="₹ (e.g. 50L - 1.5 Cr)"
                    value={clientForm.budget}
                    onChange={(e) => setClientForm({ ...clientForm, budget: e.target.value })}
                  />
                </F>
              </div>

              <F label="Site / Project Address (Optional)">
                <Input
                  data-testid="rc-address"
                  placeholder="Plot / Colony, Landmark, Pin Code"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                />
              </F>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3.5 px-6 bg-[#053c63] hover:bg-[#074b7a] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                data-testid="rc-submit"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <span>Submit Application</span> <ArrowUpRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-neutral-500 text-center">
                Approved clients receive credentials via email within 24 hours.
              </div>
            </form>
          ) : (
            /* CONTRACTOR / PROFESSIONAL FORM */
            <form onSubmit={submitContractor} className="space-y-4" data-testid="contractor-register-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Contact Person Name *">
                  <Input
                    required
                    data-testid="rp-name"
                    placeholder="e.g. Er. Vikram Vardhan"
                    value={contractorForm.full_name}
                    onChange={(e) => setContractorForm({ ...contractorForm, full_name: e.target.value })}
                  />
                </F>
                <F label="Business / Company *">
                  <Input
                    required
                    data-testid="rp-biz"
                    placeholder="e.g. Vardhan BuildTech LLP"
                    value={contractorForm.business_name}
                    onChange={(e) => setContractorForm({ ...contractorForm, business_name: e.target.value })}
                  />
                </F>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Official Email *">
                  <Input
                    required
                    type="email"
                    data-testid="rp-email"
                    placeholder="contact@vardhanbuild.com"
                    value={contractorForm.email}
                    onChange={(e) => setContractorForm({ ...contractorForm, email: e.target.value })}
                  />
                </F>
                <F label="Phone / WhatsApp *">
                  <Input
                    required
                    type="tel"
                    data-testid="rp-phone"
                    placeholder="+91 98276 00000"
                    value={contractorForm.phone}
                    onChange={(e) => setContractorForm({ ...contractorForm, phone: e.target.value })}
                  />
                </F>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Operating City *">
                  <Input
                    required
                    data-testid="rp-city"
                    placeholder="e.g. Indore, Bhopal, Pune"
                    value={contractorForm.city}
                    onChange={(e) => setContractorForm({ ...contractorForm, city: e.target.value })}
                  />
                </F>
                <F label="Years of Experience (Optional)">
                  <Input
                    type="number"
                    data-testid="rp-exp"
                    placeholder="e.g. 8"
                    value={contractorForm.experience_years}
                    onChange={(e) => setContractorForm({ ...contractorForm, experience_years: e.target.value })}
                  />
                </F>
              </div>

              <F label="Office / Studio Address (Optional)">
                <Input
                  data-testid="rp-address"
                  placeholder="Studio No., Commercial Complex, City"
                  value={contractorForm.address}
                  onChange={(e) => setContractorForm({ ...contractorForm, address: e.target.value })}
                />
              </F>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3.5 px-6 bg-[#053c63] hover:bg-[#074b7a] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                data-testid="rp-submit"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <span>Register Business</span> <ArrowUpRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-neutral-500 text-center">
                Approved partners receive credentials via email within 24 hours.
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function RegisterComponent(props) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-neutral-500">Loading registration...</div>}>
      <RegisterContent {...props} />
    </Suspense>
  );
}

const F = ({ label, children }) => (
  <label className="block">
    <div className="label-caps mb-2 text-neutral-700 font-semibold">{label}</div>
    {children}
  </label>
);
