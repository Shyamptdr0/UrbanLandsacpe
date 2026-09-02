"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Users,
  Compass,
  Building2,
  Paintbrush,
  Wrench,
  Truck,
  Sparkles,
  Wallet,
  FileCheck2,
  Search,
  Calendar,
  X,
  Loader2,
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";

const PRO_BENEFITS = [
  {
    icon: TrendingUp,
    title: "Get Quality Leads",
    desc: "Get matched with verified homeowners and commercial developers in your city looking for your exact skills.",
  },
  {
    icon: Briefcase,
    title: "Showcase Your Portfolio",
    desc: "Build a stunning digital storefront displaying your best projects, team credentials, and verified client testimonials.",
  },
  {
    icon: Users,
    title: "Connect with Potential Clients",
    desc: "Receive RFP notifications, chat directly with potential clients, send quotations, and win contracts transparently.",
  },
  {
    icon: ShieldCheck,
    title: "Increase Visibility in Your City",
    desc: "Enhance your business visibility in search listings within your service locations and build long-term trust.",
  },
];

const CONTRACTOR_SAFEGUARDS = [
  {
    number: "01",
    title: "Escrow-Guaranteed Disbursements",
    tag: "FINANCIAL CERTAINTY",
    desc: "Client milestone funds are deposited into neutral escrow before groundbreaking. Complete the stage, pass the audit, and receive your funds without delay.",
    icon: Wallet,
  },
  {
    number: "02",
    title: "Standardized Milestone Agreements",
    tag: "SCOPE PROTECTION",
    desc: "Never perform unpaid work. Digital contracts clearly define billable variations, architect sign-offs, and agreed completion dates.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Zero Brokerage or Commission Cuts",
    tag: "MAXIMUM MARGINS",
    desc: "Keep 100% of your contractual rate card. We charge zero commission on your labor, materials, or profit margins.",
    icon: Search,
  },
];

const ELIGIBLE_PARTNERS = [
  {
    icon: Compass,
    title: "Architect",
    desc: "Design studios and planners",
  },
  {
    icon: Building2,
    title: "Engineer",
    desc: "Structural, civil & consultants",
  },
  {
    icon: Paintbrush,
    title: "Interior Designer",
    desc: "Decorators & space planners",
  },
  {
    icon: Wrench,
    title: "Contractor",
    desc: "Civil works and execution teams",
  },
  {
    icon: Truck,
    title: "Material Dealer",
    desc: "Suppliers of cement, steel, wood, tiles, etc.",
  },
];

const PRO_STATS = [
  { value: "100%", label: "Milestone Payout Escrow", detail: "Zero bad debts or delayed contractor funds" },
  { value: "500+", label: "Verified Projects Assigned", detail: "Across residential, villas & retail" },
  { value: "₹0", label: "Commission On Your Margins", detail: "Transparent direct client collaboration" },
  { value: "1000+", label: "Registered Specialists", detail: "Architects, engineers & civil builders" },
];

export default function JoinContractorPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    category: "General Contractor (Civil Works)",
    city: "",
    experience: "",
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await api.post("/inquiries", {
        first_name: bookingForm.name.split(" ")[0] || bookingForm.name,
        last_name: bookingForm.name.split(" ").slice(1).join(" ") || "Partner",
        email: bookingForm.email,
        phone: bookingForm.phone,
        service_type: `Partner Ingestion (${bookingForm.category})`,
        message: `Firm: ${bookingForm.businessName} | City: ${bookingForm.city || "Indore"} | Experience: ${bookingForm.experience || "N/A"} years`,
      });
      toast.success("Partner inquiry received! Our onboarding director will connect within 24 hours.");
      setIsBookingOpen(false);
      setBookingForm({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        category: "General Contractor (Civil Works)",
        city: "",
        experience: "",
      });
    } catch {
      toast.error("Failed to submit inquiry. Please call +91 98276 02453 directly.");
    }
    setBookingLoading(false);
  };

  return (
    <div className="bg-[#F4F3EF] text-[#1A1A1A] min-h-screen flex flex-col font-sans selection:bg-[#053c63] selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - CONSISTENT WITH ABOUT & SERVICES PAGES */}
        <section className="w-full pt-16 md:pt-24 pb-14 md:pb-18 border-b border-neutral-200/70 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-left max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 label-caps text-[#053c63] mb-4 font-semibold tracking-[0.22em] uppercase text-xs">
                <Sparkles size={14} className="text-[#053c63]" /> For Construction Professionals
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Grow Your Construction <br />
                <span className="italic font-serif font-normal text-[#053c63]">Business</span>.
              </h1>

              <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                Join Urban Landscape as an Architect, Structural Engineer, Interior Designer, Contractor, or Material Dealer. Win pre-qualified clients with guaranteed milestone disbursements.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/contractor/register"
                  className="px-6 py-3 bg-[#053c63] hover:bg-[#074b7a] text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                >
                  <span>Register Your Business</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3 bg-white border border-neutral-300 text-neutral-800 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Calendar size={14} className="text-[#053c63]" /> Partner Inquiries
                </button>

                <Link
                  href="/login?tab=contractor"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-[#053c63] transition-colors ml-2"
                >
                  Contractor Portal Login →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 1: PRO BENEFITS & SIGNATURE SHOWCASE (EXACT ABOUT/SERVICES DUAL LAYOUT) */}
        <section className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="flex items-center justify-between w-full flex-col md:flex-row gap-12 lg:gap-16">
            {/* Left: Charcoal #1A1A1A Card with Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 bg-[#1A1A1A] text-white p-7 sm:p-9 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
            >
              {/* Top Row: Tag Pill & Trending Icon */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-[#053c63]/20 border border-[#053c63]/40 text-[#053c63] text-white/90">
                  WHY URBAN LANDSCAPE?
                </span>

                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#053c63]">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Expand Your Reach & <br />
                <span className="italic font-serif font-normal text-neutral-400">Build Trust Faster</span>.
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed mb-8">
                Say goodbye to chasing delayed payments, low-budget tire kickers, and spending fortunes on lead brokers. We connect you directly with qualified homeowners ready to build.
              </p>

              {/* 4 Benefits in 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                {PRO_BENEFITS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="space-y-1.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 text-[#053c63]">
                        <Icon size={16} className="text-white" />
                        <span className="text-xs font-bold text-white tracking-tight">{b.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Link */}
              <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/contractor/register"
                  className="text-xs font-semibold uppercase tracking-widest text-white hover:text-neutral-300 flex items-center gap-2 transition-colors"
                >
                  <span>Apply As A Partner</span>
                  <ArrowRight size={14} />
                </Link>
                <span className="text-[11px] font-mono text-neutral-500">Fast-Track Verification</span>
              </div>
            </motion.div>

            {/* Right: Signature Ultra-Curved Image with Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 aspect-[4/5] relative rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl group border border-stone-200/80"
            >
              <img
                src="https://urbanlandscape.in/_next/static/media/work.00800f6c.jpg"
                alt="Construction Professionals On Site"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Floating Pro Network Badge Card */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-4 border border-white/40">
                <div className="w-12 h-12 rounded-full bg-[#053c63]/10 flex items-center justify-center text-[#053c63] shrink-0">
                  <Briefcase size={26} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">
                    Business Network
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                    100% Verified Professional Network
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Architects · Engineers · Turnkey Builders · Material Dealers
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: CASH FLOW & CONTRACTOR SAFEGUARDS */}
        <section className="w-full py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF] border-t border-neutral-200/70">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="max-w-3xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 label-caps text-[#053c63] font-semibold text-xs tracking-widest uppercase">
                <Wallet size={14} /> Guaranteed Cash Flow
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Never Chase Payments <br />
                <span className="italic font-serif font-normal text-[#053c63]">Or Absorb Bad Debts Again</span>.
              </h2>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                We understand that executing civil, architectural, and interior works carries massive financial exposure. Urban Landscape secures your payout before you pour the first column.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CONTRACTOR_SAFEGUARDS.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#053c63]/10 text-[#053c63]">
                          {p.tag}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#053c63]">
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
                        {p.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span>SAFEGUARD {p.number}</span>
                      <Check size={14} className="text-[#053c63]" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: THE PRO ADVANTAGE METRICS ROW */}
        <section className="w-full py-16 px-6 sm:px-8 lg:px-12 bg-white border-y border-neutral-200/70">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {PRO_STATS.map((s, idx) => (
                <div key={idx} className="space-y-1.5 border-l-2 border-[#053c63] pl-4">
                  <div className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-light">
                    {s.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: ELIGIBLE PARTNERS / WHO CAN JOIN */}
        <section className="w-full py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-[#1A1A1A] text-white relative">
          <div className="max-w-7xl mx-auto space-y-14">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#053c63] bg-white/10 px-3 py-1 rounded-full text-white">
                Who Can Join
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Eligible Partners
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                We welcome licensed, professional practices and individual experts in the field of construction, architecture, and interior finishes.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 sm:gap-6">
              {ELIGIBLE_PARTNERS.map((pro) => {
                const Icon = pro.icon;
                return (
                  <div
                    key={pro.title}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-center space-y-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#053c63] text-white flex items-center justify-center mx-auto transition-colors">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white tracking-tight">{pro.title}</h4>
                      <p className="text-[11px] text-neutral-400 font-light mt-1 leading-relaxed">
                        {pro.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5: BOTTOM CALL TO ACTION */}
        <section className="w-full py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF]">
          <div className="max-w-5xl mx-auto bg-[#1A1A1A] text-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 md:p-16 border border-white/10 shadow-2xl text-center space-y-8 relative overflow-hidden">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#053c63] bg-white/10 px-4 py-1.5 rounded-full font-bold text-white">
                Scale Your Practice
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Ready to Accelerate Your Business?
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                Registration is simple. Submit your business credentials, verify your license, and start bidding on verified projects in your city today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/contractor/register"
                className="w-full sm:w-auto px-8 py-4 bg-[#053c63] hover:bg-[#074b7a] text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Register Your Practice</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar size={14} />
                <span>Partner Consultation</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* PARTNER CONSULTATION POPUP MODAL (WITH CUSTOM SCROLLBAR) */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent
          className="bg-[#1A1A1A] text-white border border-white/15 rounded-3xl sm:rounded-4xl p-0 max-w-xl w-full shadow-2xl overflow-hidden"
          data-testid="contractor-inquiry-modal"
        >
          <div className="p-6 sm:p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-modal-scrollbar space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#053c63] font-bold text-white/80">
                  Partner Ingestion · Network
                </span>
                <DialogTitle className="text-xl sm:text-2xl font-heading font-bold text-white mt-1">
                  Schedule Partner Onboarding Call
                </DialogTitle>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Connect with our partner relations director to discuss project flow, escrow milestones, and bidding setup.
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. Vikram Vardhan"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#053c63] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Firm / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vardhan BuildTech LLP"
                    value={bookingForm.businessName}
                    onChange={(e) => setBookingForm({ ...bookingForm, businessName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#053c63] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@vardhanbuild.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#053c63] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98276 00000"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#053c63] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Practice Category
                  </label>
                  <select
                    value={bookingForm.category}
                    onChange={(e) => setBookingForm({ ...bookingForm, category: e.target.value })}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#053c63] transition-colors cursor-pointer"
                  >
                    <option value="General Contractor (Civil Works)">General Contractor (Civil Works)</option>
                    <option value="Architectural Studio">Architectural Studio</option>
                    <option value="Structural Engineering Firm">Structural Engineering Firm</option>
                    <option value="Interior Design Practice">Interior Design Practice</option>
                    <option value="Material Dealer / Supplier">Material Dealer / Supplier</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Operating City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indore, Bhopal, Pune"
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#053c63] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  Years in Business
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={bookingForm.experience}
                  onChange={(e) => setBookingForm({ ...bookingForm, experience: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#053c63] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-[#053c63] hover:bg-[#074b7a] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Submit Partner Onboarding Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
