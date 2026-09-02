"use client";

import { useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Handshake,
  Search,
  PencilRuler,
  Hammer,
  Building2,
  House,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const STEPS = [
  {
    step: "01",
    title: "Book a meeting",
    duration: "1 - 2 Days",
    role: "Client Relationship Lead & Architect",
    summary:
      "Schedule a session to learn about us and our process. Your journey starts with a conversation where we align your vision with our expertise.",
    deliverables: [
      "Initial Project Requirement Assessment",
      "Plot Dimensions & Zoning Feasibility Check",
      "Architectural Style Preferences & Preliminary Budget",
    ],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Architectural Consultation & Vision Alignment",
    imageBadge: "Consultation & Discovery",
    icon: Handshake,
  },
  {
    step: "02",
    title: "Do your research",
    duration: "3 - 5 Days",
    role: "Technical Advisor",
    summary:
      "Explore reference sites, get a preliminary quote, and review our industry-leading contracts. Transparency is our foundation.",
    deliverables: [
      "Physical Site Visits to Ongoing Masterworks",
      "Preliminary Parametric Cost Estimation",
      "Draft Digital Contract & Escrow Milestone Structure",
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Site Assessment & Contract Transparency",
    imageBadge: "Feasibility & BOQ Audit",
    icon: Search,
  },
  {
    step: "03",
    title: "Begin design",
    duration: "2 - 3 Weeks",
    role: "Senior Empanelled Architect & 3D Visualizer",
    summary:
      "Make the design phase payment to begin crafting your dream home designed by our empanelled architects. Watch your vision take form.",
    deliverables: [
      "Detailed 2D Architectural Floor Plans & Elevations",
      "Photorealistic 3D Exterior & Interior Walkthroughs",
      "Structural Engineering Load Calculations & Column Grid",
    ],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "3D BIM Visualization & Custom Floor Plans",
    imageBadge: "Architectural Craftsmanship",
    icon: PencilRuler,
  },
  {
    step: "04",
    title: "Pre-Construction",
    duration: "1 - 2 Weeks",
    role: "Chartered Structural Engineer & Site Ops",
    summary:
      "We handle the rest—soil tests, final quotations, project plans, contractor meetings, and all legal formalities while you prepare for the build.",
    deliverables: [
      "Core Soil Bearing Capacity (SBC) Lab Report",
      "Itemized Digital Bill of Quantities (BOQ) with Locked Rates",
      "Contractor Onboarding, Municipal Sanctions & Site Barricading",
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Soil Bearing Tests & Municipal Sanctions",
    imageBadge: "Engineering & Approvals",
    icon: Hammer,
  },
  {
    step: "05",
    title: "Construction",
    duration: "6 - 12 Months",
    role: "Resident Site Engineer & QC Auditor",
    summary:
      "Track progress through weekly updates, scheduled meetings, and detailed reports. Watch your dream rise with precision and quality.",
    deliverables: [
      "Milestone-Gated Construction Execution",
      "Daily Timestamped Photo Logs & Slump/Tensile Test Reports",
      "Client Approval Sign-Off Before Escrow Fund Release",
    ],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Milestone Structural Execution & Daily QC",
    imageBadge: "Precision Construction",
    icon: Building2,
  },
  {
    step: "06",
    title: "Handover and Housewarming",
    duration: "1 - 2 Weeks",
    role: "Principal Architect & Quality Lead",
    summary:
      "From dream to reality—enjoy a seamless handover backed by a structural stability certificate and a five-year structural warranty.",
    deliverables: [
      "Comprehensive 120-Point Snag List Closure",
      "Formal Structural Stability & Municipal Completion Documents",
      "5-Year Structural Warranty & Digital Maintenance Dossier",
    ],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Snag-Free Handover & 5-Year Warranty",
    imageBadge: "Certified Completion",
    icon: House,
  },
];

const COMPARISON_DATA = [
  {
    feature: "Payment Protection",
    traditional: "Heavy advance payments with high risk of stalled work or dispute",
    urban: "100% Escrow Milestone Shield: Funds released only after site quality inspection & your approval",
  },
  {
    feature: "Pricing Transparency",
    traditional: "Vague lump-sum quotes leading to 25-40% unexpected cost escalations",
    urban: "Itemized Digital BOQ with locked material pricing and zero hidden surprises",
  },
  {
    feature: "Progress Monitoring",
    traditional: "Unreliable verbal updates; client forced to physically visit chaotic construction sites",
    urban: "24/7 Digital Dashboard with daily geo-tagged photo logs, concrete cube lab reports & stage status",
  },
  {
    feature: "Quality Assurance",
    traditional: "Sub-contracted laborers with unsupervised mixing and non-standard rebars",
    urban: "Empanelled Grade-A contractors, strict M40/M50 concrete cube slump tests, and structural audits",
  },
  {
    feature: "Warranty & Handover",
    traditional: "Zero accountability once final payment is handed over",
    urban: "Official 5-Year Structural Stability Warranty certificate & dedicated post-handover support",
  },
];

const FAQS = [
  {
    q: "How does the Escrow Milestone payment model protect me?",
    a: "Instead of paying huge advance amounts directly to contractors, your stage payments are deposited into a secure milestone escrow account. The contractor is only paid once our quality engineers and you inspect and digitally approve that particular milestone (e.g. foundation, plinth, slab pouring).",
  },
  {
    q: "Can I customize the architectural plans during Step 03?",
    a: "Yes, Step 03 is fully collaborative! Our empanelled senior architects work closely with you across multiple iterations to refine 2D floor plans, spatial layouts, Vastu compliance, and 3D architectural renders until you are 100% satisfied.",
  },
  {
    q: "What happens if there are unexpected site soil or structural conditions?",
    a: "During Step 04 (Pre-Construction), we conduct scientific soil bore tests to evaluate the Soil Bearing Capacity (SBC). This ensures your structural foundation depth and column reinforcement are scientifically engineered specifically for your plot's soil profile.",
  },
  {
    q: "How do I monitor site progress if I live in another city or country (NRI)?",
    a: "Our platform provides a live project tracking dashboard. You receive daily geo-tagged, timestamped site photos, weekly drone overviews, material testing lab certificates, and video calls with your resident site engineer.",
  },
  {
    q: "What warranties and legal guarantees are provided upon handover?",
    a: "Every project built through Urban Landscape receives an authorized Structural Stability Certificate issued by a certified chartered structural engineer, along with a comprehensive 5-Year Structural Warranty and digital maintenance handbook.",
  },
];

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    meetingType: "Online Video Consultation",
    date: "",
    timeSlot: "Morning (10:00 AM - 01:00 PM)",
    projectType: "",
    notes: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await api.post("/inquiries", {
        first_name: bookingForm.name,
        last_name: `[Booking: ${bookingForm.meetingType}]`,
        email: bookingForm.email,
        details: `Meeting Request:\nPhone: ${bookingForm.phone}\nType: ${bookingForm.meetingType}\nPreferred Date: ${bookingForm.date}\nTime Slot: ${bookingForm.timeSlot}\nProject/Plot Details: ${bookingForm.projectType}\nNotes: ${bookingForm.notes}`,
      });
      toast.success("Meeting request submitted! Our architectural team will confirm your slot within 2 hours.");
      setIsBookingOpen(false);
      setBookingForm({
        name: "",
        phone: "",
        email: "",
        meetingType: "Online Video Consultation",
        date: "",
        timeSlot: "Morning (10:00 AM - 01:00 PM)",
        projectType: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to submit meeting request. Please call us directly at +91 98276 02453.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F4F3EF] min-h-screen font-sans text-[#1a1a1a] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION - LEFT ALIGNED WITH MODERATE FONT SIZE */}
        <section className="w-full pt-16 md:pt-24 pb-14 md:pb-18 border-b border-neutral-200/70 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-left max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] mb-4 font-semibold tracking-[0.22em] uppercase text-xs">
                <Sparkles size={14} className="text-[#A14732]" /> Transparent Construction Methodology
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Our Building Process{" "}
                <span className="italic font-serif font-normal text-[#053c63]">at a Glance</span>
              </h1>

              <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                Follow our streamlined process from concept to handover. Simple, transparent, and built for your peace of mind.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#timeline"
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#A14732] transition-all shadow-md"
                >
                  Explore 6 Steps
                </a>

              </div>
            </motion.div>
          </div>
        </section>

        {/* TIMELINE / PROCESS STEPS SECTION */}
        <section id="timeline" className="relative max-w-7xl mx-auto px-6 py-24 md:py-36">
          {/* Vertical central divider line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#1A1A1A]/15 -translate-x-1/2 hidden md:block" />

          <div className="flex flex-col gap-24 sm:gap-32 md:gap-40 lg:gap-48">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 !== 0; // 0-based: 0 (Step 01: Card Left, Photo Right), 1 (Step 02: Photo Left, Card Right)

              return (
                <div
                  key={item.step}
                  className={`relative flex items-center justify-between w-full flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"
                    }`}
                >
                  {/* Process Details Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-[44%] bg-[#1A1A1A] text-white p-7 sm:p-9 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 hover:border-[#A14732]/40 relative z-10 transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      {/* Mobile Stage Image Banner */}
                      <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-5 border border-white/10 md:hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[10px] font-mono font-semibold bg-[#1A1A1A]/90 backdrop-blur-md px-2.5 py-1 rounded border border-white/20">
                            {item.imageCaption}
                          </span>
                          <span className="text-[10px] font-mono text-white bg-[#A14732] px-2 py-0.5 rounded font-semibold">
                            {item.imageBadge}
                          </span>
                        </div>
                      </div>

                      {/* Step Header info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#A14732]/15 border border-[#A14732]/40 flex items-center justify-center text-[#A14732] md:hidden">
                            <Icon className="w-5 h-5 text-[#A14732]" />
                          </div>
                          <span className="text-xs font-bold text-[#A14732] uppercase tracking-widest font-mono bg-[#A14732]/15 px-3 py-1 rounded-full border border-[#A14732]/40">
                            Step {item.step}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                          <Clock size={12} className="text-[#A14732]" /> {item.duration}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight group-hover:text-[#A14732] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-neutral-300 leading-relaxed text-base font-light">
                        {item.summary}
                      </p>

                      {/* Key Deliverables Pill Checklist */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <div className="text-[10px] uppercase font-mono font-bold text-[#A14732] tracking-wider">
                          Key Deliverables:
                        </div>
                        {item.deliverables.map((del, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-neutral-200 leading-tight">
                            <CheckCircle2 size={14} className="text-[#A14732] shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-[11px] font-medium">
                        <span className="font-semibold text-[#A14732]">Lead Role:</span>{" "}
                        <span className="text-neutral-300">{item.role}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Desktop Center Circle Icon */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1A1A1A] border-4 border-white/15 rounded-full items-center justify-center shadow-2xl hidden md:flex z-20 group hover:border-[#A14732] hover:scale-110 transition-all cursor-pointer"
                  >
                    <Icon className="w-6 h-6 text-[#A14732]" />
                  </motion.div>

                  {/* Desktop Stage-wise Visual Photographic Showcase Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden md:block w-full md:w-[44%] h-[380px] lg:h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 hover:border-[#A14732]/40 relative group transition-all duration-300 bg-[#1A1A1A]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-6 right-6">
                      <span className="bg-[#1A1A1A]/90 backdrop-blur-md text-white text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-[#A14732]/40 shadow-md">
                        {item.imageBadge}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                      <div className="text-[11px] font-mono tracking-widest uppercase text-[#A14732] font-semibold">
                        Stage {item.step} Highlight
                      </div>
                      <div className="text-xl lg:text-2xl font-bold font-heading text-white leading-snug">
                        {item.imageCaption}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPARISON SECTION: Traditional vs. Urban Landscape */}
        <section className="w-full py-20 px-6 md:px-12 bg-[#F4F3EF] border-y border-neutral-200/70">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A14732] font-bold">
                The Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0f172a] font-heading">
                Traditional Building vs. Urban Landscape
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base font-light">
                Why thousands of homebuilders choose our tech-driven escrow and engineering framework over informal contractor setups.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b-2 border-neutral-300/80">
                    <th className="py-4 px-6 text-xs uppercase tracking-widest font-mono text-neutral-500 w-1/4">
                      Feature
                    </th>
                    <th className="py-4 px-6 text-xs uppercase tracking-widest font-mono text-neutral-500 w-[37.5%] bg-black/[0.03]">
                      Traditional Unorganized Contractors
                    </th>
                    <th className="py-4 px-6 text-xs uppercase tracking-widest font-mono text-[#A14732] w-[37.5%] bg-[#A14732]/10 font-bold">
                      Urban Landscape Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/80">
                  {COMPARISON_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                      <td className="py-5 px-6 font-semibold text-sm text-[#0f172a]">
                        {row.feature}
                      </td>
                      <td className="py-5 px-6 text-sm text-neutral-600 bg-black/[0.02]">
                        <div className="flex items-start gap-2.5">
                          <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-neutral-900 bg-[#A14732]/5">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-[#A14732] shrink-0 mt-0.5" />
                          <span>{row.urban}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="w-full py-20 px-6 md:px-12 bg-[#F4F3EF]">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A14732] font-bold">
                Clear Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] font-heading">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base font-light">
                Everything you need to know about our end-to-end building methodology and contracts.
              </p>
            </div>

            <div className="divide-y divide-neutral-300/80 border-y border-neutral-300/80">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                    >
                      <span className="font-heading text-lg md:text-xl font-semibold text-[#0f172a] group-hover:text-[#A14732] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-neutral-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#A14732]" : ""
                          }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-neutral-600 text-sm md:text-base leading-relaxed font-light">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ZERO RISK CONTRACTING BANNER */}
        <section className="w-full pb-28 pt-8 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#1A1A1A] text-white p-8 sm:p-10 md:p-14 rounded-xs border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl"
            >
              <div>
                <div className="flex items-center gap-2 label-caps text-[#E37A5F] mb-3 font-semibold text-xs tracking-widest uppercase">
                  <ShieldCheck size={16} /> Free & No-Obligation Consultation
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  Ready to build your dream home? Let’s talk.
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="px-7 py-4 bg-[#053c63] hover:bg-[#8e3e2b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl shrink-0 cursor-pointer"
              >
                Book a Meeting <ArrowUpRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* BOOK A MEETING POPUP MODAL */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-xl bg-[#1A1A1A] text-white border border-white/15 shadow-2xl p-6 sm:p-8 rounded-2xl max-h-[86vh] flex flex-col overflow-hidden">
            <DialogHeader className="text-left space-y-1.5 pb-4 border-b border-white/10 shrink-0">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A14732] font-semibold">
                <Calendar size={14} /> Schedule Consultation
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Book a Meeting
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto custom-modal-scrollbar pr-3 -mr-2 flex-1 pt-4 pb-1">
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Meeting Mode *
                    </label>
                    <select
                      value={bookingForm.meetingType}
                      onChange={(e) => setBookingForm({ ...bookingForm, meetingType: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A14732] transition-colors cursor-pointer"
                    >
                      <option value="Online Video Consultation">Online Video (Google Meet)</option>
                      <option value="Studio Meeting (Vijay Nagar, Indore)">Studio Visit (Indore)</option>
                      <option value="Site Visit Consultation">Site Visit Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A14732] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A14732] transition-colors cursor-pointer"
                    >
                      <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                      <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Plot / Project Scope
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2400 sq.ft Villa, Indore"
                      value={bookingForm.projectType}
                      onChange={(e) => setBookingForm({ ...bookingForm, projectType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us any specific architectural preferences or questions..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors resize-none"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3.5 bg-[#A14732] hover:bg-[#8e3e2b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} /> Confirm Meeting Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
