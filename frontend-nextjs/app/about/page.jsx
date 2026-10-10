"use client";

import { useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Layers,
  Award,
  History,
  ShieldCheck,
  Compass,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Loader2,
  HardHat,
  Eye,
  Building2,
  Smartphone,
  Handshake,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATS = [
  { value: "1000+", label: "Registered Pros", icon: Users },
  { value: "500+", label: "Projects Planned", icon: Layers },
  { value: "300+", label: "Verified Dealers", icon: Award },
  { value: "2000+", label: "Happy Clients", icon: History },
];

const PILLARS = [
  {
    title: "Seamless Connections",
    desc: "Thoughtfully integrating price estimation, rate comparison, and direct communication into one unified platform.",
    icon: Users,
  },
  {
    title: "Reliable Choices",
    desc: "No more endless searching or confusion. Find verified professionals based on your specific needs, style, and budget.",
    icon: Award,
  },
  {
    title: "Complete Clarity",
    desc: "Removing the hassle from construction and design, giving you the confidence to plan and create from the comfort of your home.",
    icon: Compass,
  },
];

const COLLABORATION_FEATURES = {
  client: [
    {
      title: "Real-Time Site Monitoring",
      desc: "Track daily progress with geo-tagged, timestamped site photos and video updates uploaded directly by site engineers.",
    },
    {
      title: "Protected Escrow Milestones",
      desc: "Your funds stay completely safe in escrow and are released to the contractor only after quality checks pass.",
    },
    {
      title: "Digital Rate & BOQ Transparency",
      desc: "Every material brand, specification, and line-item rate is locked in advance with zero surprise escalations.",
    },
    {
      title: "Direct Architectural Oversight",
      desc: "Collaborate directly with your architect and contractor in one unified workspace with instant approvals.",
    },
  ],
  contractor: [
    {
      title: "Verified Public Portfolio",
      desc: "Build your professional digital profile, upload finished sites, showcase craftsmanship, and earn client reviews.",
    },
    {
      title: "Direct Quality Project Inquiries",
      desc: "Get genuine residential and commercial leads matched to your execution capacity with zero middleman commissions.",
    },
    {
      title: "Guaranteed Milestone Payouts",
      desc: "No more delayed client payments. Escrow funds are released immediately upon certified milestone completion.",
    },
    {
      title: "Digital Site & Material Management",
      desc: "Manage work orders, track material deliveries, submit stage reports, and coordinate site teams from one dashboard.",
    },
  ],
};

export default function About() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("client"); // "client" | "contractor"
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
        last_name: `[About Consultation: ${bookingForm.meetingType}]`,
        email: bookingForm.email,
        details: `About Page Meeting Request:\nPhone: ${bookingForm.phone}\nType: ${bookingForm.meetingType}\nPreferred Date: ${bookingForm.date}\nTime Slot: ${bookingForm.timeSlot}\nProject Scope: ${bookingForm.projectType}\nNotes: ${bookingForm.notes}`,
      });
      toast.success("Meeting request submitted! Our team will confirm your slot within 2 hours.");
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
        {/* HERO SECTION - LEFT ALIGNED STONE & TERRACOTTA THEME */}
        <section className="w-full pt-16 md:pt-24 pb-14 md:pb-18 border-b border-neutral-200/70 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-left max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] mb-4 font-semibold tracking-[0.22em] uppercase text-xs">
                <Sparkles size={14} className="text-[#A14732]" /> About Urban Landscape
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Building <span className="italic font-serif font-normal text-[#053c63]">Together</span>.
              </h1>

              <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                A smart, technology-driven platform designed to unite clients and contractors into one collaborative, transparent, and hassle-free construction ecosystem.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#platform-moto"
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#A14732] transition-all shadow-md"
                >
                  Our Tech + Construction Vision
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

        {/* SECTION 1: OUR MOTTO - TECH + CONSTRUCTION COLLABORATION */}
        <section id="platform-moto" className="w-full py-20 md:py-32 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF] border-b border-neutral-200/70">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase">
                <Handshake size={14} /> The Collaboration Hub
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Connecting Clients & Contractors with{" "}
                <span className="italic font-serif font-normal text-[#A14732]">Technology</span>.
              </h2>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                Traditional construction often suffers from misunderstandings, hidden costs, and lack of accountability. Urban Landscape bridges this divide through an online platform where clients and contractors collaborate in complete transparency.
              </p>
            </div>

            {/* Interactive Dual Pillar: Client vs Contractor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Card 1: For Clients */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#1A1A1A] text-white p-8 sm:p-10 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A14732]/20 border border-[#A14732]/40 text-[#A14732] text-xs font-mono font-semibold uppercase tracking-wider">
                      <Eye size={14} /> For Property Owners
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732]">
                      <Smartphone size={22} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Client Portal: Monitor Your Build Live
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base font-light mt-2 leading-relaxed">
                      As a homeowner, you have complete visibility over your project from foundation to handover without having to visit the dusty site daily.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-white/10">
                    {COLLABORATION_FEATURES.client.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-[#A14732] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-white">{feat.title}</p>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed mt-0.5">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/login?tab=client"
                    className="text-xs font-semibold uppercase tracking-wider text-[#A14732] hover:text-white transition-colors flex items-center gap-2"
                  >
                    Explore Client Dashboard <ArrowRight size={14} />
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Zero Blind Spots
                  </span>
                </div>
              </motion.div>

              {/* Card 2: For Contractors */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#1A1A1A] text-white p-8 sm:p-10 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A14732]/20 border border-[#A14732]/40 text-[#A14732] text-xs font-mono font-semibold uppercase tracking-wider">
                      <Briefcase size={14} /> For AEC Professionals & Builders
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732]">
                      <HardHat size={22} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      AEC Professionals Hub: Build & Showcase Your Portfolio
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base font-light mt-2 leading-relaxed">
                      AEC Professionals can add their verified portfolio, showcase past structures, receive qualified client leads, and get guaranteed on-time milestone payouts.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-4 border-t border-white/10">
                    {COLLABORATION_FEATURES.contractor.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-[#A14732] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-white">{feat.title}</p>
                          <p className="text-xs text-neutral-400 font-light leading-relaxed mt-0.5">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href="/login?tab=contractor"
                    className="text-xs font-semibold uppercase tracking-wider text-[#A14732] hover:text-white transition-colors flex items-center gap-2"
                  >
                    Join as Verified AEC Professional <ArrowRight size={14} />
                  </Link>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Guaranteed Payouts
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 2: A SMART ALL-IN-ONE PLATFORM (AS ON URBANLANDSCAPE.IN) */}
        <section className="w-full py-20 md:py-32 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF] border-b border-neutral-200/70">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left: Content & Stats */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase">
                  <Sparkles size={14} /> The Construction Ecosystem
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                  A Smart <br />
                  <span className="italic font-serif font-normal text-[#A14732]">All-in-One Platform</span>.
                </h2>
              </div>

              <div className="space-y-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                <p>
                  Urban Landscape is a smart, all-in-one platform designed to bring the entire construction ecosystem together. It empowers architects, engineers, interior designers, contractors, and material dealers to register themselves and become part of a growing, trusted community.
                </p>
                <p>
                  For businesses, Urban Landscape opens doors to genuine potential clients. And for clients, it simplifies the journey of building or designing their space by helping them easily discover the right professionals based on their needs, style, and budget.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-neutral-300/80">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2 text-[#A14732]">
                        <Icon size={16} />
                      </div>
                      <p className="text-3xl font-black font-heading text-[#1A1A1A] tracking-tight leading-none">
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

            {/* Right: Architectural Image from live site with floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-neutral-300/50">
                <img
                  src="https://urbanlandscape.in/_next/static/media/workimg.d6747325.jpg"
                  alt="Architectural Blueprint and Execution"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#A14732] font-semibold">
                    The Smart Standard
                  </p>
                  <p className="text-base sm:text-lg font-semibold font-heading mt-0.5">
                    Architectural Blueprint & Digital Handover
                  </p>
                </div>
              </div>

              {/* Floating Verified Network Badge (as on urbanlandscape.in) */}
              <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 bg-[#1A1A1A] p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex items-center gap-4 sm:gap-5 border border-white/15 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-[#A14732]/20 border border-[#A14732]/40 flex items-center justify-center text-[#A14732] shrink-0">
                  <Compass size={22} />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-mono font-bold text-neutral-400 tracking-widest">
                    Verified Network
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-0.5">
                    Trusted Pros
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: 3 CORE PILLARS (CHARCOAL #1A1A1A DARK SECTION) */}
        <section className="w-full bg-[#1A1A1A] text-white py-24 md:py-36 px-6 sm:px-8 lg:px-12 relative overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10 space-y-16">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase">
                <Sparkles size={14} /> How We Deliver
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Built on Three Core{" "}
                <span className="italic font-serif font-normal text-[#A14732]">Foundations</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PILLARS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 p-8 sm:p-10 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-[#A14732]/40 transition-all duration-300 group flex flex-col justify-between space-y-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#A14732]/15 border border-[#A14732]/30 flex items-center justify-center text-[#A14732] group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: THE VISION - CREATE WITH CONFIDENCE (WITH DRAWING IMAGE) */}
        <section className="w-full py-20 md:py-32 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF] border-b border-neutral-200/70">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            {/* Image 2 from live site */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-neutral-300/50 group">
              <img
                src="https://urbanlandscape.in/_next/static/media/Drawing.4fc7e62d.jpg"
                alt="Architect on Drafting Table"
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-700" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#A14732] font-semibold">
                  Precision Engineering
                </p>
                <p className="text-base sm:text-lg font-semibold font-heading mt-0.5">
                  Civil Blueprints to Structural Realization
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase">
                <Sparkles size={14} /> The Vision
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Create with <br />
                <span className="italic font-serif font-normal text-[#A14732]">Confidence</span>.
              </h2>

              <div className="space-y-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                <p>
                  From price estimation and rate comparison to seamless connections—all the essentials are thoughtfully integrated into one platform. No more endless searching or confusion—just clarity, convenience, and reliable choices.
                </p>
                <p>
                  Urban Landscape is built to remove the hassle from construction and design, so you can plan, connect, and create your dream space with confidence—right from the comfort of your home.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/login?tab=client"
                  className="px-7 py-3.5 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#A14732] transition-all shadow-md flex items-center gap-2"
                >
                  Join as Client <ArrowRight size={14} />
                </Link>
                <Link
                  href="/login?tab=contractor"
                  className="px-7 py-3.5 bg-white border border-neutral-300 text-neutral-800 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  Register as AEC Professional <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ZERO RISK CONSULTATION BANNER - SAME CONSISTENT COMPONENT */}
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
