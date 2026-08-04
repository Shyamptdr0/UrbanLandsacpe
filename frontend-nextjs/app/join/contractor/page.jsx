"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

const BENEFITS = [
  { t: "Quality Leads", d: "Verified clients matched to your category and city." },
  { t: "Portfolio Showcase", d: "A dedicated feed for your best signature work." },
  { t: "Direct Connection", d: "Zero middleman — talk to clients through the portal." },
  { t: "City-wide Visibility", d: "Ranked placements in your service catchment." },
];

const CATEGORIES = ["Architect", "Engineer", "Interior Designer", "Contractor", "Material Dealer"];

export default function JoinContractor() {
  const router = useRouter();
  const [f, setF] = useState({
    full_name: "", business_name: "", email: "", phone: "",
    address: "", city: "", experience_years: 0, portfolio_urls: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/register/contractor", { ...f, experience_years: Number(f.experience_years) || 0 });
      toast.success("Application received. Admin will send your credentials on approval.");
      setTimeout(() => router.push("/contractor/login"), 1500);
    } catch (err) { toast.error(err.response?.data?.detail || "Registration failed"); }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#F4F3EF]">
      <Navbar />
      <section className="marketing-container pt-16 pb-20 grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-6">
          <div className="label-caps mb-6 text-terracotta">Professional Portal</div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95]">
            Grow your <span className="italic font-normal">construction</span> business.
          </h1>
          <p className="mt-8 text-neutral-600 max-w-lg leading-relaxed">
            List your practice on Urban Landscape and get discovered by clients ready to build. We handle onboarding, verification and lead routing.
          </p>
          <div className="mt-10 space-y-3">
            {BENEFITS.map((b) => (
              <div key={b.t} className="flex items-start gap-4 border-t border-stone-alt pt-4">
                <CheckCircle2 size={18} className="text-terracotta mt-0.5 shrink-0" />
                <div>
                  <div className="font-heading text-lg tracking-tight">{b.t}</div>
                  <div className="text-sm text-neutral-600">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <div className="label-caps mb-4">Who Can Join Us</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((n) => (
                <span key={n} className="text-xs uppercase tracking-widest border border-stone-alt bg-white px-3 py-2">{n}</span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="md:col-span-6 bg-white border border-stone-alt p-8 md:p-10 h-fit md:sticky md:top-24" data-testid="contractor-register-form">
          <div className="label-caps mb-2">Register Your Business</div>
          <div className="font-heading text-3xl tracking-tight">Professional Registration</div>
          <p className="text-sm text-neutral-600 mt-2">Approved partners get a unique ID + password via email.</p>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <F label="Full Name"><Input required data-testid="rp-name" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></F>
            <F label="Business / Company"><Input required data-testid="rp-biz" value={f.business_name} onChange={(e) => setF({ ...f, business_name: e.target.value })} /></F>
            <F label="Years of Experience"><Input type="number" data-testid="rp-exp" value={f.experience_years} onChange={(e) => setF({ ...f, experience_years: e.target.value })} /></F>
            <F label="City"><Input data-testid="rp-city" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></F>
            <F label="Email"><Input required type="email" data-testid="rp-email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></F>
            <F label="Phone"><Input required data-testid="rp-phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></F>
            <div className="md:col-span-2"><F label="Address"><Input data-testid="rp-address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></F></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-terra mt-8 w-full justify-center" data-testid="rp-submit">
            {submitting ? "Submitting..." : "Register Business"} <ArrowUpRight size={16} />
          </button>
          <div className="mt-4 text-sm text-neutral-500 text-center">
            Already have an account? <Link href="/contractor/login" className="text-terracotta underline underline-offset-4">Contractor Login</Link>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}

const F = ({ label, children }) => (
  <label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>
);
