"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

const HERO_IMG = "https://images.unsplash.com/photo-1628012209120-d9db7abf7eab?crop=entropy&cs=srgb&fm=jpg&q=80&w=1600";
const BLUEPRINT = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200";
const INTERIOR = "https://images.pexels.com/photos/20418771/pexels-photo-20418771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const PORT1 = "https://images.pexels.com/photos/9458996/pexels-photo-9458996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const PORT2 = "https://images.pexels.com/photos/37582309/pexels-photo-37582309.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

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
    headline: "Architecting Legacies. Engineering Precision.",
    subheadline: "Central India’s premier architectural construction platform — uniting visionary clients, certified contractors, and structural engineers under a single transparent ecosystem.",
    background_image: HERO_IMG,
  });
  const [signature, setSignature] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", project_type: "Residential Villa", details: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get("/cms/hero").then(({ data }) => setHero((h) => ({ ...h, ...data }))).catch(() => {});
    api.get("/cms/signature-projects").then(({ data }) => setSignature(data)).catch(() => {});
    api.get("/cms/testimonials").then(({ data }) => setTestimonials(data)).catch(() => {});
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
      <section className="relative min-h-[95vh] overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 w-full h-full transform-gpu">
          <img
            src={hero.background_image || HERO_IMG}
            alt="Urban Landscape Architecture"
            className="w-full h-full object-cover scale-100"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#F4F3EF]" />
        </div>

        <div className="relative marketing-container pt-36 md:pt-44 pb-20 min-h-[95vh] flex flex-col justify-between text-stone z-10">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="transform-gpu"
            >
              <div className="inline-flex items-center gap-2.5 label-caps text-white/95 mb-6 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Architectural Engineering · Est. 2024 · Indore</span>
              </div>

              <h1
                data-testid="hero-headline"
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[96px] leading-[0.94] font-medium text-white tracking-tighter drop-shadow-md max-w-4xl"
              >
                {hero.headline}
              </h1>

              <p className="mt-7 max-w-2xl text-stone/90 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                {hero.subheadline}
              </p>

              {/* Trust Pill Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-xs text-white/80 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-terracotta-light" />
                  <span>100% Escrow Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-terracotta-light" />
                  <span>Verified ISO 9001 Contractors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-terracotta-light" />
                  <span>10-Year Structural Guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Portal CTA Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
            className="grid md:grid-cols-2 gap-5 md:gap-6 mt-12 transform-gpu"
          >
            <Link
              href="/join/client"
              data-testid="hero-client-cta"
              className="group relative bg-white/95 hover:bg-white transition-all duration-300 ease-out p-7 md:p-8 flex items-start justify-between border border-white/60 backdrop-blur-md text-charcoal rounded-xs hover:shadow-2xl hover:-translate-y-1 transform-gpu"
            >
              <div>
                <div className="flex items-center gap-2 label-caps text-terracotta font-semibold">
                  <Compass size={14} /> Client Portal
                </div>
                <div className="font-heading text-2xl md:text-3xl mt-2.5 tracking-tight text-charcoal group-hover:text-terracotta transition-colors duration-200">
                  Build Your Project
                </div>
                <div className="text-sm text-neutral-600 mt-1.5 leading-relaxed max-w-sm">
                  Discover verified architects & contractors, calculate costs, track daily site progress.
                </div>
              </div>
              <div className="w-11 h-11 rounded-full border border-charcoal/15 flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white transition-all duration-200 shrink-0 ml-4">
                <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" size={20} />
              </div>
            </Link>

            <Link
              href="/join/contractor"
              data-testid="hero-contractor-cta"
              className="group relative bg-charcoal/95 hover:bg-charcoal text-stone transition-all duration-300 ease-out p-7 md:p-8 flex items-start justify-between border border-white/20 backdrop-blur-md rounded-xs hover:shadow-2xl hover:-translate-y-1 transform-gpu"
            >
              <div>
                <div className="flex items-center gap-2 label-caps text-terracotta-light font-semibold">
                  <Hammer size={14} /> Professional Portal
                </div>
                <div className="font-heading text-2xl md:text-3xl mt-2.5 tracking-tight group-hover:text-terracotta-light transition-colors duration-200">
                  Partner As A Professional
                </div>
                <div className="text-sm text-white/70 mt-1.5 leading-relaxed max-w-sm">
                  Access premium client inquiries, manage stage approvals, receive guaranteed milestone payouts.
                </div>
              </div>
              <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-terracotta-light group-hover:border-terracotta-light group-hover:text-charcoal transition-all duration-200 shrink-0 ml-4">
                <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" size={20} />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AUTHORITY & STRUCTURAL INTEGRITY SECTION */}
      <section className="marketing-container py-28 md:py-36">
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

        {/* Bento Image Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16 transform-gpu"
        >
          <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden border border-stone-alt rounded-xs group shadow-sm">
            <img
              src={BLUEPRINT}
              alt="Architectural Blueprint & Structural Calculations"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out transform-gpu"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <div className="label-caps text-terracotta-light">Precision Engineering</div>
                <div className="font-heading text-2xl font-medium mt-1">3D Structural BIM Modeling</div>
              </div>
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 label-caps text-charcoal border border-stone-alt font-medium shadow-xs rounded-full">
                100% Quality Audited
              </div>
            </div>
          </div>

          <div className="md:col-span-5 grid gap-6">
            <div className="relative aspect-[16/9] overflow-hidden border border-stone-alt rounded-xs group shadow-sm">
              <img
                src={INTERIOR}
                alt="Interior Architectural Craftsmanship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out transform-gpu"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="label-caps text-terracotta-light">Interior Fit-Out</div>
                <div className="font-heading text-xl">Bespoke Joinery & Finishes</div>
              </div>
            </div>

            <div className="bg-charcoal text-stone p-8 rounded-xs flex-1 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 border border-white/10 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-terracotta/10 pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 label-caps text-terracotta-light">
                  <Award size={14} /> Ecosystem Network
                </div>
                <div className="font-heading text-3xl mt-3 tracking-tight leading-snug text-white">
                  The Master Builder Hub.
                </div>
              </div>
              <div className="text-sm text-white/75 mt-4 leading-relaxed">
                Direct access to vetted structural engineers, principal architects, MEP consultants, and bulk material dealers.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SIGNATURE MASTERWORKS SECTION */}
      <section className="border-t border-stone-alt bg-white">
        <div className="marketing-container py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 transform-gpu"
          >
            <div>
              <div className="label-caps mb-3 text-terracotta font-semibold">Portfolio Showcase</div>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-none text-charcoal">
                Signature <br />
                <span className="italic font-normal">Masterworks.</span>
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
            className="grid grid-cols-1 md:grid-cols-12 gap-6 transform-gpu"
          >
            {(signature.length
              ? signature
              : [
                  { id: "p1", title: "Aasa Residence", category: "Residential Villa", location: "Vijay Nagar, Indore", image_url: PORT1, floors: "G+3", dimensions: "48×72 ft" },
                  { id: "p2", title: "Studio Rám", category: "Architectural Studio", location: "Indore", image_url: PORT2, floors: "G+1", dimensions: "32×40 ft" },
                  { id: "p3", title: "Apex Institution", category: "Institutional", location: "Pune", image_url: INTERIOR, floors: "G+4", dimensions: "120×200 ft" },
                ]
            )
              .slice(0, 3)
              .map((p, i) => (
                <motion.div
                  key={p.id || i}
                  variants={fadeInUp}
                  className={`${
                    i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"
                  } group relative overflow-hidden border border-stone-alt bg-[#F4F3EF] rounded-xs shadow-xs hover:shadow-2xl transition-all duration-300 ease-out transform-gpu`}
                >
                  <div className={`${i === 0 ? "aspect-[16/11]" : "aspect-[16/10]"} overflow-hidden bg-stone-200 relative`}>
                    <img
                      src={p.image_url || PORT1}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out transform-gpu"
                    />
                    <div className="absolute top-4 left-4 bg-charcoal/80 text-white backdrop-blur-md text-[11px] uppercase tracking-widest px-3 py-1 font-medium rounded-full">
                      {p.category || "Residential"}
                    </div>
                  </div>
                  <div className="p-6 flex items-end justify-between bg-white/95 backdrop-blur-xs">
                    <div>
                      <div className="label-caps text-neutral-500">{p.location || "Central India"}</div>
                      <div className="font-heading text-2xl md:text-3xl mt-1.5 tracking-tight text-charcoal group-hover:text-terracotta transition-colors duration-200">
                        {p.title}
                      </div>
                      <div className="text-xs text-neutral-500 mt-2 marker-num font-mono">{p.floors} · {p.dimensions}</div>
                    </div>
                    <Link
                      href="/projects"
                      className="w-10 h-10 rounded-full border border-stone-alt flex items-center justify-center group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-white transition-colors duration-200 shrink-0 ml-4"
                    >
                      <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS / METHODOLOGY SECTION */}
      <section className="marketing-container py-28 md:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-12 gap-10 transform-gpu"
        >
          <motion.div variants={fadeInUp} className="md:col-span-4">
            <div className="label-caps mb-4 text-terracotta font-semibold">Structured Workflow</div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-none text-charcoal">
              The Building <br />
              <span className="italic font-normal text-terracotta">Methodology.</span>
            </h2>
            <p className="mt-6 text-neutral-600 max-w-sm text-base leading-relaxed">
              A transparent 4-phase framework designed to eliminate cost overruns, delays, and poor workmanship.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-alt border border-stone-alt shadow-sm rounded-xs overflow-hidden">
            {PROCESS.map((s) => (
              <div
                key={s.n}
                className="bg-[#F4F3EF] p-8 hover:bg-white transition-all duration-300 ease-out group hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="marker-num text-terracotta text-sm font-bold font-mono">{s.n}</div>
                    <span className="text-[10px] uppercase tracking-widest bg-stone-100 text-neutral-600 px-2.5 py-0.5 rounded-full border border-stone-200">
                      {s.tagline}
                    </span>
                  </div>
                  <div className="font-heading text-2xl mt-5 tracking-tight text-charcoal group-hover:text-terracotta transition-colors duration-200">
                    {s.title}
                  </div>
                  <div className="text-sm text-neutral-600 mt-3 leading-relaxed">{s.body}</div>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-alt/80 text-[11px] font-medium text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-terracotta" />
                  <span>Key Output: {s.deliverable}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

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
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                        form.project_type === type
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
