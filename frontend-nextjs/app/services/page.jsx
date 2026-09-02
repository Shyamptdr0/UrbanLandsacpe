"use client";

import { useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Building2,
  Paintbrush,
  Hammer,
  Ruler,
  ShieldCheck,
  Compass,
  Gem,
  Clock,
  Zap,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VERTICALS = [
  {
    id: "01",
    vertical: "Structural Excellence",
    title: "End-to-End Construction",
    tagline: "Foundation to Handover",
    description:
      "We transform empty plots into architectural legacies. Our construction methodology combines advanced civil engineering with premium material sourcing to deliver structures that stand the test of time.",
    features: [
      "Foundation to Handover",
      "RCC Structural Design",
      "Material Quality Audits",
      "Labor & Site Management",
    ],
    icon: Building2,
    image: "https://urbanlandscape.in/_next/static/media/construction.485c1978.jpg",
    imageCaption: "End-to-End Construction",
  },
  {
    id: "02",
    vertical: "Living Art",
    title: "Bespoke Interior Design",
    tagline: "Atmospheric & Spatial Harmony",
    description:
      "Interior design is the soul of a home. We create immersive spaces that balance your personal narrative with contemporary aesthetics, ensuring every corner reflects your lifestyle.",
    features: [
      "3D Visualizations & Walkthroughs",
      "Custom Teak & Veneer Joinery",
      "Architectural Lighting Design",
      "Material & Texture Mapping",
    ],
    icon: Paintbrush,
    image: "https://urbanlandscape.in/_next/static/media/interior.87327520.jpg",
    imageCaption: "Bespoke Interior Design",
  },
  {
    id: "03",
    vertical: "Legacy Restoration",
    title: "Premium Renovation",
    tagline: "Structural Rebirth & Modernisation",
    description:
      "Breathing new life into existing structures. We specialize in complex renovations that upgrade the functionality and aesthetic of your space without compromising its structural integrity.",
    features: [
      "Space Re-modeling & Expansion",
      "Modern Seismic Retrofitting",
      "Eco-Friendly Energy Upgrades",
      "Complete Aesthetic Overhaul",
    ],
    icon: Hammer,
    image: "https://urbanlandscape.in/_next/static/media/Renovation.cda37c50.jpg",
    imageCaption: "Premium Renovation",
  },
  {
    id: "04",
    vertical: "Strategic Planning",
    title: "Consultancy & Design",
    tagline: "Precision Blueprints & Clear Costing",
    description:
      "Precision begins on the drawing board. Our consultancy services provide you with Vastu-compliant blueprints, structural stability reports, and comprehensive project feasibility studies.",
    features: [
      "Architectural & Working Blueprints",
      "Certified Vastu Consultancy",
      "Line-Item BOQ Cost Estimation",
      "Municipal Liaisoning & Approvals",
    ],
    icon: Ruler,
    image: "https://urbanlandscape.in/_next/static/media/Drawingss.ab9c3113.jpg",
    imageCaption: "Consultancy & Design",
  },
];

const ADVANTAGE_STATS = [
  { value: "100%", label: "Transparency", icon: ShieldCheck },
  { value: "99.9%", label: "Precision", icon: Compass },
  { value: "Elite", label: "Efficiency", icon: Zap },
  { value: "Fixed", label: "Delivery", icon: Clock },
];

const ADVANTAGE_PILLARS = [
  {
    title: "Architects",
    desc: "Expert visionary studio.",
    icon: Compass,
  },
  {
    title: "Materiality",
    desc: "Premium global sourcing.",
    icon: Gem,
  },
  {
    title: "Safety",
    desc: "Certified civil standards.",
    icon: ShieldCheck,
  },
  {
    title: "Modernity",
    desc: "Contemporary living tech.",
    icon: Building2,
  },
];

export default function Services() {
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
        last_name: `[Services Booking: ${bookingForm.meetingType}]`,
        email: bookingForm.email,
        details: `Service Consultation Request:\nPhone: ${bookingForm.phone}\nType: ${bookingForm.meetingType}\nPreferred Date: ${bookingForm.date}\nTime Slot: ${bookingForm.timeSlot}\nProject Scope: ${bookingForm.projectType}\nNotes: ${bookingForm.notes}`,
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
        {/* HERO SECTION - LEFT ALIGNED AS ON HOW-IT-WORKS */}
        <section className="w-full pt-16 md:pt-24 pb-14 md:pb-18 border-b border-neutral-200/70 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-left max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] mb-4 font-semibold tracking-[0.22em] uppercase text-xs">
                <Sparkles size={14} className="text-[#A14732]" /> The Urban Standard
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Mastering the{" "}
                <span className="italic font-serif font-normal text-[#053c63]">Art</span> of Build.
              </h1>

              <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                From foundation to finish, we bring precision and passion to every square foot of your future legacy.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#verticals"
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#A14732] transition-all shadow-md"
                >
                  Explore Verticals
                </a>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3 bg-white border border-neutral-300 text-neutral-800 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Calendar size={14} className="text-[#A14732]" /> Book Consultation
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4 CORE VERTICALS SECTION */}
        <section id="verticals" className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-36">
          <div className="flex flex-col gap-24 sm:gap-32 md:gap-40">
            {VERTICALS.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 !== 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex items-center justify-between w-full flex-col ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-10 lg:gap-16`}
                >
                  {/* Service Details Card - Charcoal #1A1A1A with White Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-1/2 bg-[#1A1A1A] text-white p-7 sm:p-9 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group"
                  >
                    {/* Top Row: Service Number & Vertical Pill */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#A14732]/20 border border-[#A14732]/40 text-[#A14732]">
                          VERTICAL {item.id}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                          {item.vertical}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732]">
                        <Icon size={18} />
                      </div>
                    </div>

                    {/* Service Title */}
                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                      {item.title}.
                    </h2>

                    {/* Description */}
                    <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Features List (2-column on desktop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-white/10">
                      {item.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
                          <CheckCircle2 size={14} className="text-[#A14732] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                      <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white hover:text-[#A14732] transition-colors group/link"
                      >
                        <span>Explore Projects</span>
                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingForm((prev) => ({ ...prev, projectType: item.title }));
                          setIsBookingOpen(true);
                        }}
                        className="text-xs font-semibold tracking-wider uppercase text-[#A14732] hover:text-white transition-colors cursor-pointer"
                      >
                        Inquire Vertical ↗
                      </button>
                    </div>
                  </motion.div>

                  {/* Visual Showcase Card matching live site aspect-[4/5] & rounded-[4rem] */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full md:w-1/2 relative group"
                  >
                    <div className="relative aspect-[4/5] rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-neutral-300/40">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                      {/* Bottom Caption Overlay */}
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-[10px] uppercase font-mono tracking-widest text-[#A14732] font-semibold">
                          {item.tagline}
                        </p>
                        <p className="text-base sm:text-lg font-semibold font-heading mt-0.5">
                          {item.imageCaption}
                        </p>
                      </div>
                    </div>

                    {/* Floating Service Vertical Badge Card (as on urbanlandscape.in) */}
                    <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 bg-[#1A1A1A] p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex items-center gap-4 sm:gap-5 border border-white/15 group-hover:-translate-y-2 transition-transform duration-500">
                      <div className="w-12 h-12 rounded-full bg-[#A14732]/20 border border-[#A14732]/40 flex items-center justify-center text-[#A14732] shrink-0">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-mono font-bold text-neutral-400 tracking-widest">
                          Service Vertical
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-0.5">
                          {item.vertical}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* THE URBAN ADVANTAGE - COMMITMENT SECTION (AS ON LIVE SITE) */}
        <section className="w-full bg-[#1A1A1A] text-white py-24 md:py-36 px-6 sm:px-8 lg:px-12 relative overflow-hidden border-y border-white/10">
          {/* Blueprint Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Side: Advantage Heading & Metrics */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase">
                  <Sparkles size={14} /> Our Commitment
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  The Urban <br />
                  <span className="italic font-serif font-normal text-[#A14732]">Advantage.</span>
                </h2>
                <p className="text-neutral-400 text-base sm:text-lg font-light max-w-md leading-relaxed">
                  We don’t just build structures; we build trust through absolute transparency and architectural innovation.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {ADVANTAGE_STATS.map((stat, i) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={i} className="space-y-2 group">
                      <div className="text-[#A14732] group-hover:scale-110 transition-transform origin-left">
                        <StatIcon size={18} />
                      </div>
                      <p className="text-3xl sm:text-4xl font-black font-heading text-white tracking-tight leading-none">
                        {stat.value}
                      </p>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: 4 Pillars Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ADVANTAGE_PILLARS.map((pillar, i) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 p-7 sm:p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-[#A14732]/40 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#A14732]/15 border border-[#A14732]/30 flex items-center justify-center text-[#A14732] mb-6 group-hover:scale-110 transition-transform duration-300">
                      <PillarIcon size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg font-heading tracking-wide mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ZERO RISK CONSULTATION BANNER - SAME AS ON HOW-IT-WORKS */}
        <section className="w-full pb-28 pt-16 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF]">
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

        {/* BOOK A MEETING POPUP MODAL WITH CUSTOM SCROLLBAR */}
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
