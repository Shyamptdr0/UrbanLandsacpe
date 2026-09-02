"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Building2,
  Ruler,
  Hammer,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Compass,
  Layers,
  Award,
  PhoneCall,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STAT_CHIPS = [
  { label: "Reinforcement", value: "FE 550D TMT", highlight: "Highest Tensile" },
  { label: "Concrete Grade", value: "M40 / M50", highlight: "Lab Certified" },
  { label: "Safety & Audit", value: "100% Compliant", highlight: "ISO 9001:2015" },
  { label: "Structural Warranty", value: "10 Years", highlight: "Legal Guarantee" },
  { label: "Delivery Precision", value: "99.4% On-Time", highlight: "Milestone Locked" },
  { label: "Financial Security", value: "Escrowed", highlight: "Stage Disbursements" },
];

const PROCESS = [
  {
    n: "01",
    title: "Strategic Discovery",
    tagline: "Vision & Feasibility Analysis",
    body: "We conduct 3D topographic site analysis, zoning audits, and personal lifestyle consultations to define clear design boundaries.",
    deliverable: "Feasibility Report & Architectural Brief",
  },
  {
    n: "02",
    title: "BIM & 3D Blueprinting",
    tagline: "Ultra-Realistic Renders & BOQ",
    body: "Full structural modeling, line-item material BOQs, and photo-realistic 3D walkthroughs before a single brick is laid.",
    deliverable: "Complete Blueprint Package & Fixed Budget",
  },
  {
    n: "03",
    title: "Milestone Contracting",
    tagline: "Escrow Protected Disbursements",
    body: "Contractors, engineers, and clients sign a synchronized timeline with milestone-gated payment releases.",
    deliverable: "Legally Binding Escrow Schedule",
  },
  {
    n: "04",
    title: "Precision Execution",
    tagline: "Stage-Wise Lab & Site Audits",
    body: "Daily site log uploads, stage-by-stage photo verification, slump tests, and strict contractor milestone approvals.",
    deliverable: "Live Dashboard & Quality Sign-offs",
  },
];

const HERO_IMG = "/imagebg-urban.webp";
const BLUEPRINT = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200";
const INTERIOR = "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const PORT1 = "https://images.pexels.com/photos/9458996/pexels-photo-9458996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const PORT2 = "https://images.pexels.com/photos/37582309/pexels-photo-37582309.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const MASTERWORKS_SLIDES = [
  {
    id: 1,
    title: "Aasa Residence & Structural Villa",
    category: "Residential Villa Construction",
    contractor: "Vardhan Constructions & Co.",
    location: "Vijay Nagar, Indore",
    specs: "G+3 Structure · 5,200 sq ft · M40 Grade Concrete",
    image: PORT1,
    badge: "100% On-Time Handover",
  },
  {
    id: 2,
    title: "3D BIM Blueprint & Structural Calculation",
    category: "BIM & Structural Audit",
    contractor: "Apex Structural Engineers",
    location: "Indore & Central India",
    specs: "FE 550D TMT · Lab Certified Slump Tests",
    image: BLUEPRINT,
    badge: "ISO 9001:2015 Audited",
  },
  {
    id: 3,
    title: "Studio Rám Contemporary Hub",
    category: "Architectural Studio Build",
    contractor: "Matrix BuildTech Ltd.",
    location: "South Tukoganj, Indore",
    specs: "Bespoke Steel & Glass Elevation · G+1",
    image: PORT2,
    badge: "Escrow Protected",
  },
  {
    id: 4,
    title: "Bespoke Luxury Interior & Joinery",
    category: "Interior Fit-Out",
    contractor: "Urban Signature Interiors",
    location: "Bavdhan, Pune",
    specs: "Teak Joinery · Acoustic Soundproofing",
    image: INTERIOR,
    badge: "Turnkey Execution",
  },
  {
    id: 5,
    title: "The Grand Estate Villa Elevation",
    category: "Luxury Estate",
    contractor: "Shree Ram Engineering",
    location: "Super Corridor, Indore",
    specs: "G+2 Estate · Custom Swimming Pool & Landscaping",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    badge: "10-Year Warranty",
  },
];

const SIGNATURE_PROJECTS_DATA = [
  {
    id: "proj-1",
    isProjectOfTheWeek: true,
    title: "Aasa Residence & Structural Villa",
    category: "Residential Villa",
    location: "Vijay Nagar, Indore, MP",
    area: "3,456 sq ft",
    dimensions: "48 × 72 ft",
    floors: "G + 3 Floors",
    creator: {
      architect: "Ar. Sharad Chaurasia",
      contractor: "Vardhan BuildTech Ltd.",
      role: "Lead Architect & Engineering Team",
    },
    images: [
      PORT1,
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
      BLUEPRINT,
    ],
  },
  {
    id: "proj-2",
    isProjectOfTheWeek: false,
    title: "Studio Rám Creative Hub",
    category: "Architectural Studio",
    location: "South Tukoganj, Indore, MP",
    area: "1,280 sq ft",
    dimensions: "32 × 40 ft",
    floors: "G + 1 Floor",
    creator: {
      architect: "Rám Design Studio",
      contractor: "Matrix BuildTech",
      role: "Principal Design Partner",
    },
    images: [
      PORT2,
      INTERIOR,
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    ],
  },
  {
    id: "proj-3",
    isProjectOfTheWeek: false,
    title: "Apex Educational Institution",
    category: "Institutional Build",
    location: "Bavdhan, Pune, MH",
    area: "24,000 sq ft",
    dimensions: "120 × 200 ft",
    floors: "G + 4 Floors",
    creator: {
      architect: "Global Infra Lab",
      contractor: "Shree Ram Engineering",
      role: "Vetted EPC Contractor",
    },
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
      INTERIOR,
      PORT1,
    ],
  },
];

const PROJECT_TYPES = ["Residential Villa", "Luxury Apartment", "Commercial Hub", "Interior Fit-Out", "Structural Renovation"];

const smoothEase = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export default function Home() {
  const [hero, setHero] = useState({
    headline: "Urban Landscape",
    background_image: HERO_IMG,
  });
  const [signature, setSignature] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", project_type: "Residential Villa", details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get("/cms/hero").then(({ data }) => setHero((h) => ({ ...h, ...data }))).catch(() => { });
    api.get("/cms/signature-projects").then(({ data }) => setSignature(data)).catch(() => { });
    api.get("/cms/testimonials").then(({ data }) => setTestimonials(data)).catch(() => { });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/inquiries", form);
      toast.success("Inquiry received! Our senior architect will get in touch within 24 hours.");
      setForm({ first_name: "", last_name: "", email: "", project_type: "Residential Villa", details: "" });
    } catch {
      toast.error("Something went wrong. Please try again or call directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F3EF] text-charcoal overflow-x-hidden selection:bg-terracotta selection:text-white font-sans">
      <Navbar overlay />

      {/* HERO SECTION */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed background image & cinematic overlay */}
        <div className="absolute inset-0 w-full h-full transform-gpu">
          <img
            src={hero.background_image || HERO_IMG}
            alt="Urban Landscape Architecture — Buildings and Green Environment"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Atmospheric gradient overlay: dark top for white title legibility, smooth fade to #F4F3EF matching reference */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 via-55% to-[#F4F3EF]" />
        </div>

        {/* Top spacer for navbar */}
        <div className="h-20 w-full shrink-0" />

        {/* Center Content: Giant Title + Two Pill CTA Buttons */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center justify-center text-center my-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="w-full flex flex-col items-center"
          >
            {/* Main Hero Headline */}
            {(() => {
              const text = hero.headline || "Urban Landscape";
              if (text.toLowerCase() === "urban landscape") {
                return (
                  <h1
                    data-testid="hero-headline"
                    className="flex flex-wrap items-baseline justify-center text-center leading-[0.92] tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                  >
                    <span className="font-heading font-extrabold uppercase text-white tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[118px]">
                      URBAN
                    </span>
                    <span className="font-serif italic font-normal text-white tracking-normal ml-3 sm:ml-5 md:ml-7 text-6xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[118px]">
                      Landscape
                    </span>
                  </h1>
                );
              }
              const words = text.split(" ");
              return (
                <h1
                  data-testid="hero-headline"
                  className="flex flex-wrap items-baseline justify-center text-center leading-[0.92] tracking-tighter drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                >
                  <span className="font-heading font-extrabold uppercase text-white tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[118px]">
                    {words[0]}
                  </span>
                  {words.length > 1 && (
                    <span className="font-serif italic font-normal text-white tracking-normal ml-3 sm:ml-5 md:ml-7 text-6xl sm:text-7xl md:text-8xl lg:text-[104px] xl:text-[118px]">
                      {words.slice(1).join(" ")}
                    </span>
                  )}
                </h1>
              );
            })()}

            {/* Portal Action Buttons (Compact card design with single-line titles) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-8 sm:mt-10 md:mt-12 w-full max-w-3xl px-3">
              {/* Client Portal Button (White Card) */}
              <Link
                href="/join/client"
                data-testid="hero-client-cta"
                className="group w-full sm:w-auto flex-1 bg-white hover:bg-neutral-50 text-neutral-900 px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.32)] hover:-translate-y-0.5 transition-all duration-300 ease-out border border-white"
              >
                <div className="flex flex-col text-left mr-4">
                  <div className="flex items-center gap-1.5">
                    <Compass size={13} className="text-[#A14732]" />
                    <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] text-[#A14732] uppercase leading-none">
                      Client Portal
                    </span>
                  </div>
                  <span className="font-heading text-lg sm:text-xl lg:text-[22px] font-medium tracking-tight text-[#1A1A1A] mt-1.5 leading-tight whitespace-nowrap">
                    Build Your Project
                  </span>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-800 transition-all duration-300 group-hover:border-neutral-800 group-hover:scale-105">
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </div>
              </Link>

              {/* Professional Portal Button (Dark Card) */}
              <Link
                href="/join/contractor"
                data-testid="hero-contractor-cta"
                className="group w-full sm:w-auto flex-1 bg-[#141414] hover:bg-black text-white px-5 sm:px-6 py-4 sm:py-4.5 flex items-center justify-between shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.32)] hover:-translate-y-0.5 transition-all duration-300 ease-out border border-neutral-800/80"
              >
                <div className="flex flex-col text-left mr-4">
                  <div className="flex items-center gap-1.5">
                    <Hammer size={13} className="text-[#A14732]" />
                    <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] text-[#A14732] uppercase leading-none">
                      Professional Portal
                    </span>
                  </div>
                  <span className="font-heading text-lg sm:text-xl lg:text-[22px] font-medium tracking-tight text-white mt-1.5 leading-tight whitespace-nowrap">
                    Partner As A Professional
                  </span>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0 text-white transition-all duration-300 group-hover:border-white group-hover:scale-105">
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="relative z-10 pb-6 sm:pb-8 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contractor-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex flex-col items-center gap-1.5 text-[10px] sm:text-[11px] font-medium tracking-[0.26em] text-neutral-600 hover:text-neutral-900 uppercase transition-colors duration-200 cursor-pointer"
            aria-label="Scroll to explore"
          >
            <span>Scroll to Explore</span>
            <ChevronDown size={14} className="animate-bounce text-neutral-500 group-hover:text-neutral-900 transition-colors" />
          </button>
        </div>
      </section>

      {/* CONTRACTOR MASTERWORKS SLIDER SECTION */}
      <ContractorSlider />

      {/* SIGNATURE MASTERWORKS SECTION */}
      <SignatureMasterworksSection signature={signature} />

      {/* PROCESS / METHODOLOGY SECTION (Matching User Image Design) */}
      <MethodologySection />

      {/* TESTIMONIALS SECTION */}
      <section className="bg-charcoal text-stone border-y border-charcoal relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="marketing-container py-28 relative z-10 transform-gpu"
        >
          <div className="label-caps text-white/50 mb-8 font-semibold">Client Endorsements</div>
          <div className="grid md:grid-cols-12 gap-10">
            {(testimonials.length
              ? testimonials.slice(0, 2)
              : [
                {
                  name: "Dr. Rajesh Vardhan",
                  location: "Vijay Nagar, Indore",
                  project: "G+3 Luxury Villa (5,200 sq ft)",
                  quote: "Urban Landscape didn't just build our residence; they engineered a sanctuary. Stage-by-stage stage updates and lab concrete reports gave us complete peace of mind.",
                },
                {
                  name: "Meera & Alok Kulkarni",
                  location: "Bavdhan, Pune",
                  project: "Heritage Restoration & Interior Fit-Out",
                  quote: "From initial 3D BIM blueprints to snag-list closure, every phase was executed with military discipline. Their escrowed payment model is revolutionary.",
                },
              ]
            ).map((t, i) => (
              <motion.blockquote
                key={i}
                variants={fadeInUp}
                className="md:col-span-6 border-l-2 border-terracotta pl-8 py-3 flex flex-col justify-between"
              >
                <div>
                  <div className="text-5xl font-heading text-terracotta leading-none">“</div>
                  <p className="font-heading text-2xl md:text-3xl tracking-tight leading-tight mt-3 text-white">
                    {t.quote}
                  </p>
                </div>
                <footer className="mt-8 pt-4 border-t border-white/10">
                  <div className="font-medium text-white text-base">{t.name}</div>
                  <div className="text-xs text-terracotta-light font-mono mt-0.5">{t.project || "Custom Residence"}</div>
                  <div className="text-[11px] text-white/50 uppercase tracking-widest mt-1">{t.location}</div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </section>

      {/* DIRECT INQUIRY FORM */}
      <section id="engage" className="marketing-container py-28 md:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-12 gap-16 items-start transform-gpu"
        >
          <motion.div variants={fadeInUp} className="md:col-span-5">
            <div className="label-caps mb-4 text-terracotta font-semibold">Direct Architectural Consultation</div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-none text-charcoal">
              Design your <br />
              future <span className="italic font-normal text-terracotta">with us.</span>
            </h2>
            <p className="mt-6 text-neutral-600 text-base leading-relaxed">
              Schedule a preliminary site review and 3D budget estimate with our principal architects.
            </p>

            <div className="mt-10 space-y-6">
              <ContactInfo icon={Mail} label="Direct Email Inquiry" value="sharadchaurasia@urbanlandscape.in" />
              <ContactInfo icon={PhoneCall} label="Architect Helpline" value="+91 98276 02453" />
              <ContactInfo icon={MapPin} label="Design Studio Location" value="Vijay Nagar, Indore, Madhya Pradesh" />
            </div>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={submit}
            className="md:col-span-7 bg-white border border-stone-alt p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xs"
            data-testid="inquiry-form"
          >
            <div className="label-caps mb-2 text-terracotta font-semibold">Initialize Brief</div>
            <div className="font-heading text-3xl tracking-tight text-charcoal">Request Project Estimate</div>
            <p className="text-sm text-neutral-600 mt-1.5">Fill out your requirements below and our team will get in touch within 24 hours.</p>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <Field label="First Name">
                <Input
                  required
                  data-testid="inquiry-first"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  placeholder="e.g. Vikram"
                  className="bg-[#F9F8F6] border-stone-alt focus:bg-white transition-all duration-200"
                />
              </Field>

              <Field label="Last Name">
                <Input
                  required
                  data-testid="inquiry-last"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  placeholder="e.g. Sharma"
                  className="bg-[#F9F8F6] border-stone-alt focus:bg-white transition-all duration-200"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Email Address">
                  <Input
                    required
                    type="email"
                    data-testid="inquiry-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vikram.sharma@example.com"
                    className="bg-[#F9F8F6] border-stone-alt focus:bg-white transition-all duration-200"
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <div className="label-caps mb-2 text-neutral-700">Project Category</div>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, project_type: type })}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${form.project_type === type
                        ? "bg-terracotta text-white border-terracotta font-medium"
                        : "bg-[#F9F8F6] border-stone-alt text-neutral-600 hover:border-neutral-400"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Field label="Project Scope & Plot Details">
                  <Textarea
                    required
                    rows={4}
                    data-testid="inquiry-details"
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="Specify plot dimensions, floor requirements (e.g., G+2), location, or architectural style..."
                    className="bg-[#F9F8F6] border-stone-alt focus:bg-white transition-all duration-200"
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-terra mt-8 w-full sm:w-auto justify-center"
              data-testid="inquiry-submit"
            >
              {isSubmitting ? "Submitting Inquiry..." : "Submit Project Brief"} <ArrowUpRight size={16} />
            </button>
          </motion.form>
        </motion.div>
      </section>

      {/* AUTHORITY & STRUCTURAL INTEGRITY SECTION (Moved Above Footer as Requested) */}
      <section id="standards-section" className="marketing-container py-24 md:py-32 border-t border-stone-alt">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-12 gap-10 md:gap-16 items-end transform-gpu"
        >
          <motion.div variants={fadeInUp} className="md:col-span-6">
            <div className="inline-flex items-center gap-2 label-caps mb-4 text-terracotta font-semibold">
              <Layers size={14} /> Engineering Standards
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter text-charcoal">
              Masterful <br />
              <span className="italic font-normal text-terracotta">Structuralism.</span>
            </h2>
            <p className="mt-6 text-neutral-600 max-w-md leading-relaxed text-base">
              We redefine construction stability through rigorous engineering standards. Every foundation, beam, and slab is backed by laboratory concrete testing and certified reinforcement.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-px bg-stone-alt border border-stone-alt shadow-sm rounded-xs overflow-hidden">
            {STAT_CHIPS.map((c) => (
              <div
                key={c.label}
                className="bg-[#F4F3EF] p-5 hover:bg-white transition-all duration-300 ease-out group hover-lift"
              >
                <div className="text-[10px] uppercase tracking-wider text-terracotta font-semibold">{c.highlight}</div>
                <div className="font-heading text-lg mt-1 tracking-tight font-semibold text-charcoal">{c.value}</div>
                <div className="label-caps text-neutral-500 text-[10px] mt-2">{c.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Professional Structural Engineering & Concrete Audit Image Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 transform-gpu"
        >
          <motion.div variants={fadeInUp} className="relative aspect-[16/10] rounded-xs overflow-hidden border border-stone-alt group shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?crop=entropy&cs=srgb&fm=jpg&q=80&w=800"
              alt="Laboratory Concrete Slump Testing & M40 Grade Audit"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="label-caps text-terracotta-light text-[10px] font-semibold">Lab Concrete Testing</div>
              <div className="font-heading text-xl font-medium mt-1 tracking-tight">M40 / M50 Slump & Tensile Audit</div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative aspect-[16/10] rounded-xs overflow-hidden border border-stone-alt group shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=srgb&fm=jpg&q=80&w=800"
              alt="FE 550D TMT Steel Binding & Structural BIM Modeling"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="label-caps text-terracotta-light text-[10px] font-semibold">High Tensile Steel</div>
              <div className="font-heading text-xl font-medium mt-1 tracking-tight">FE 550D TMT Rebar Binding</div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative aspect-[16/10] rounded-xs overflow-hidden border border-stone-alt group shadow-sm hover:shadow-xl transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=srgb&fm=jpg&q=80&w=800"
              alt="ISO 9001:2015 Certified Site Safety & Audit Sign-Off"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="label-caps text-terracotta-light text-[10px] font-semibold">Quality & Safety Audit</div>
              <div className="font-heading text-xl font-medium mt-1 tracking-tight">ISO 9001:2015 Site Sign-Off</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* VALUE PILLARS SECTION */}
      <section className="border-t border-stone-alt">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="marketing-container py-24 grid md:grid-cols-4 gap-px bg-stone-alt border border-stone-alt shadow-xs transform-gpu"
        >
          {[
            { icon: Ruler, t: "Verified Designs", d: "Compare architectural styles, past portfolios, and line-item estimates before hiring." },
            { icon: Hammer, t: "On-Site Rigor", d: "Daily stage-by-stage photo logs, slump tests, and structural approval checks." },
            { icon: Building2, t: "Signature Handover", d: "Turnkey delivery backed by legal 10-year structural warranty documentation." },
            { icon: ShieldCheck, t: "Milestone Escrow", d: "Guaranteed installment schedules protected by verified stage sign-offs." },
          ].map((v) => (
            <motion.div
              key={v.t}
              variants={fadeInUp}
              className="bg-[#F4F3EF] p-8 hover:bg-white transition-all duration-300 ease-out group hover-lift"
            >
              <div className="w-11 h-11 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-200">
                <v.icon size={22} />
              </div>
              <div className="font-heading text-xl mt-6 tracking-tight text-charcoal group-hover:text-terracotta transition-colors duration-200">
                {v.t}
              </div>
              <div className="text-sm text-neutral-600 mt-2 leading-relaxed">{v.d}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

function ContractorSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MASTERWORKS_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlide = MASTERWORKS_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MASTERWORKS_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MASTERWORKS_SLIDES.length) % MASTERWORKS_SLIDES.length);
  };

  return (
    <section id="contractor-works" className="marketing-container py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 label-caps text-terracotta font-semibold mb-3">
            <Hammer size={14} /> Contractor Masterworks
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none text-charcoal">
            Verified Contractor <br />
            <span className="italic font-normal text-terracotta">Master Works.</span>
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-4 self-start md:self-end">
          <div className="text-xs font-mono font-medium text-neutral-500 tracking-wider">
            <span className="text-charcoal font-bold">{String(currentIndex + 1).padStart(2, "0")}</span> / {String(MASTERWORKS_SLIDES.length).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full border border-stone-alt bg-white hover:bg-neutral-900 hover:text-white flex items-center justify-center transition-colors duration-200 shadow-xs cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full border border-stone-alt bg-white hover:bg-neutral-900 hover:text-white flex items-center justify-center transition-colors duration-200 shadow-xs cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slider Container */}
      <div
        className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] rounded-xs overflow-hidden border border-stone-alt shadow-lg group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white z-10 pointer-events-none">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-terracotta text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3 shadow-sm">
              <Award size={12} /> {currentSlide.badge}
            </div>

            <div className="label-caps text-stone-200/90 text-xs sm:text-sm font-medium">
              {currentSlide.category} · {currentSlide.contractor}
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mt-1 tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h3>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-300 font-mono mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-terracotta-light" /> {currentSlide.location}
              </span>
              <span>•</span>
              <span>{currentSlide.specs}</span>
            </div>
          </div>

          <Link
            href="/projects"
            className="pointer-events-auto btn-terra text-xs sm:text-sm shadow-md self-start md:self-end shrink-0"
          >
            View Project Details <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Slide Dots Bar */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {MASTERWORKS_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? "w-6 bg-terracotta" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectImageSlider({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextImg = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group/slider">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeIdx}
          src={images[activeIdx]}
          alt={`${title} photo ${activeIdx + 1}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </AnimatePresence>

      {/* Slide Controls overlay */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImg}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 cursor-pointer shadow-md"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextImg}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-200 z-10 cursor-pointer shadow-md"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveIdx(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIdx ? "w-4 bg-terracotta" : "w-1.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SignatureMasterworksSection({ signature }) {
  const items = signature && signature.length ? signature : SIGNATURE_PROJECTS_DATA;

  return (
    <section className="border-t border-stone-alt bg-white">
      <div className="marketing-container py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 transform-gpu"
        >
          <div>
            <div className="inline-flex items-center gap-2 label-caps mb-3 text-terracotta font-semibold">
              <Sparkles size={14} /> Portfolio Showcase
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-none text-charcoal">
              Signature <br />
              <span className="italic font-normal text-terracotta">Masterworks.</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="btn-ghost-dark self-start md:self-end"
            data-testid="view-all-projects"
          >
            Explore All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 transform-gpu"
        >
          {items.slice(0, 3).map((p, i) => {
            const isFeatured = p.isProjectOfTheWeek || i === 0;
            const imagesList = p.images || (p.image_url ? [p.image_url] : [PORT1]);
            const creatorInfo = p.creator || {
              architect: "Ar. Sharad Chaurasia",
              contractor: "Vardhan BuildTech Ltd.",
              role: "Lead Creator & Contractor",
            };

            return (
              <motion.div
                key={p.id || i}
                variants={fadeInUp}
                className={`${
                  isFeatured ? "md:col-span-7 md:row-span-2" : "md:col-span-5"
                } group relative overflow-hidden border ${
                  isFeatured ? "border-terracotta/40 shadow-xl" : "border-stone-alt shadow-sm"
                } bg-[#F4F3EF] rounded-xs hover:shadow-2xl transition-all duration-300 ease-out transform-gpu flex flex-col justify-between`}
              >
                <div>
                  {/* Photo Slider Header Container */}
                  <div className={`${isFeatured ? "aspect-[16/11]" : "aspect-[16/10]"} overflow-hidden bg-stone-200 relative`}>
                    <ProjectImageSlider images={imagesList} title={p.title} />

                    {/* Top Badges: Project of the Week & Category */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                      {isFeatured ? (
                        <div className="inline-flex items-center gap-1.5 bg-amber-500 text-neutral-950 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-amber-300 animate-pulse">
                          <Sparkles size={12} fill="currentColor" /> Project Of The Week
                        </div>
                      ) : (
                        <div className="bg-charcoal/85 text-white backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 font-medium rounded-full">
                          {p.category || "Residential"}
                        </div>
                      )}

                      {isFeatured && (
                        <div className="bg-charcoal/85 text-white backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 font-medium rounded-full">
                          {p.category || "Residential Villa"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="p-6 md:p-7 bg-white">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-terracotta font-semibold label-caps">
                      <MapPin size={13} /> {p.location || "Vijay Nagar, Indore"}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-2xl md:text-3xl mt-2 tracking-tight text-charcoal group-hover:text-terracotta transition-colors duration-200">
                      {p.title}
                    </h3>

                    {/* Area Wise Details */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-neutral-600 font-mono">
                      <span className="bg-[#F4F3EF] px-2.5 py-1 rounded-xs border border-stone-alt font-medium text-charcoal">
                        Area: {p.area || "3,456 sq ft"}
                      </span>
                      <span className="bg-[#F4F3EF] px-2.5 py-1 rounded-xs border border-stone-alt">
                        Plot: {p.dimensions || "48×72 ft"}
                      </span>
                      <span className="bg-[#F4F3EF] px-2.5 py-1 rounded-xs border border-stone-alt">
                        {p.floors || "G+3"}
                      </span>
                    </div>

                    {/* Highlight Creator / Contractor */}
                    <div className="mt-4 pt-3 border-t border-stone-alt flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                          <Award size={14} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Highlighted Creator</div>
                          <div className="font-semibold text-charcoal text-xs">
                            {creatorInfo.architect} <span className="font-normal text-neutral-500">· {creatorInfo.contractor}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/projects"
                        aria-label={`View ${p.title}`}
                        className="w-9 h-9 rounded-full border border-stone-alt flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white transition-colors duration-200 shrink-0 ml-2"
                      >
                        <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className="border-t border-stone-alt pt-4 flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={16} />
    </div>
    <div>
      <div className="label-caps text-neutral-500 text-[10px]">{label}</div>
      <div className="mt-0.5 text-base font-medium text-charcoal">{value}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <label className="block">
    <div className="label-caps mb-2 text-neutral-700">{label}</div>
    {children}
  </label>
);

const BUILDING_PROCESS_STEPS = [
  {
    n: "01",
    title: "Discovery",
    desc: "Initial design consultation & requirements gathering.",
    tagline: "Vision & Feasibility Analysis",
    icon: Compass,
  },
  {
    n: "02",
    title: "Visualization",
    desc: "Detailed 3D architectural renders & blueprints.",
    tagline: "3D BIM & BOQ Blueprinting",
    icon: Layers,
  },
  {
    n: "03",
    title: "Precision",
    desc: "Real-time construction tracking & updates.",
    tagline: "Stage-Wise Lab & Site Audits",
    icon: ShieldCheck,
  },
  {
    n: "04",
    title: "Handover",
    desc: "Seamless delivery of your dream legacy.",
    tagline: "Turnkey 10-Year Warranty Delivery",
    icon: Award,
  },
];

function MethodologySection() {
  return (
    <section className="bg-[#F4F3EF] text-charcoal py-24 md:py-36 border-y border-stone-alt relative overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1b18_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="marketing-container relative z-10">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 label-caps text-terracotta font-semibold mb-3">
              <Compass size={14} /> Methodology
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter text-charcoal">
              The Building <br />
              <span className="font-serif italic font-normal text-terracotta">Process.</span>
            </h2>
          </div>

          <p className="text-neutral-600 text-sm md:text-base max-w-sm leading-relaxed self-start md:self-end text-left md:text-right font-light">
            A seamless, transparent journey from your first sketch to the final legacy handover.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUILDING_PROCESS_STEPS.map((step) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.n}
                className="bg-white hover:bg-[#FAF9F6] border border-stone-alt hover:border-terracotta/40 p-8 rounded-xs shadow-xs hover:shadow-2xl transition-all duration-300 ease-out group relative overflow-hidden flex flex-col justify-between hover-lift transform-gpu min-h-[280px]"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-terracotta text-xs font-bold bg-terracotta/10 px-3 py-1 rounded-full border border-terracotta/20">
                      {step.n}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-stone-alt flex items-center justify-center text-charcoal group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white transition-colors duration-300">
                      <IconComp size={18} />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-heading text-2xl font-semibold text-charcoal group-hover:text-terracotta transition-colors duration-200 mt-6 tracking-tight">
                    {step.title}
                  </h3>
                  <div className="text-[11px] font-mono text-terracotta/90 uppercase tracking-wider mt-1 font-medium">
                    {step.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 text-sm mt-3 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Output Badge */}
                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-terracotta" /> Phase {step.n} Complete
                  </span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-terracotta" />
                </div>

                {/* Bottom Hover Accent Bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-terracotta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
