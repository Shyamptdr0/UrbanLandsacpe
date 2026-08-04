"use client";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const smoothEase = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } },
};

const SERVICES = [
  {
    n: "01",
    t: "End-to-End Construction",
    d: "Turnkey structural delivery from site topography & soil test to final structural handover — RCC frame, brickwork, MEP, finishes, and legal warranty.",
    tag: "Turnkey Build",
    features: ["FE 550D TMT Reinforcement", "Lab-Tested M40/M50 Concrete", "Stage-by-Stage Daily Photo Audits", "10-Year Structural Guarantee"],
  },
  {
    n: "02",
    t: "Bespoke Interior Architecture",
    d: "Custom space planning, architectural joinery, ambient lighting design, and high-end surface finishes tailored to your lifestyle and brand identity.",
    tag: "Interior Design",
    features: ["3D BIM Walkthroughs", "Custom Teak & Veneer Joinery", "Smart Lighting & Automation", "Material Samples Approval"],
  },
  {
    n: "03",
    t: "Structural Renovation",
    d: "Modernise heritage or existing structures with structural retrofitting, plumbing overhaul, facade transformation, and slab load calculations.",
    tag: "Retrofit & Renewal",
    features: ["Structural Health Audits", "Seismic Retrofitting", "Plumbing & Electrical Rewiring", "Facade Modernisation"],
  },
  {
    n: "04",
    t: "Architectural Consultancy",
    d: "Vetted principal architects and structural engineers on demand — municipal permit drawings, structural load analysis, and BOQ feasibility studies.",
    tag: "Design & Audits",
    features: ["Municipal Approval Drawings", "Line-Item BOQ Cost Estimation", "3D Elevation Renderings", "On-Site Engineer Inspections"],
  },
];

export default function Services() {
  return (
    <div className="bg-[#F4F3EF] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="marketing-container pt-20 pb-28">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 label-caps text-terracotta mb-4 font-semibold">
              <Sparkles size={14} /> Disciplines & Core Verticals
            </div>
            <h1 className="font-heading text-5xl md:text-7xl tracking-tighter leading-[0.95] max-w-4xl text-charcoal">
              Four disciplines. <span className="italic font-normal text-terracotta">One legacy.</span>
            </h1>
            <p className="mt-6 text-neutral-600 max-w-xl text-base md:text-lg leading-relaxed font-light">
              Whether you are laying the foundation of a flagship residence or renovating a commercial space, our verticals cover every stage of the building lifecycle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-16 grid md:grid-cols-2 gap-px bg-stone-alt border border-stone-alt shadow-sm rounded-xs overflow-hidden"
          >
            {SERVICES.map((s) => (
              <div
                key={s.n}
                className="bg-[#F4F3EF] hover:bg-white p-8 md:p-10 group transition-all duration-500 ease-out flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="marker-num text-terracotta text-sm font-bold font-mono">{s.n}</div>
                    <span className="text-[10px] uppercase tracking-[0.24em] bg-white border border-stone-alt px-3 py-1 rounded-full font-medium text-neutral-600">
                      {s.tag}
                    </span>
                  </div>
                  <div className="font-heading text-3xl md:text-4xl tracking-tight leading-tight mt-6 text-charcoal group-hover:text-terracotta transition-colors duration-300">
                    {s.t}
                  </div>
                  <p className="text-sm text-neutral-600 mt-4 leading-relaxed">{s.d}</p>

                  {/* Feature Bullets */}
                  <div className="mt-6 space-y-2 border-t border-stone-alt/60 pt-4">
                    {s.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
                        <CheckCircle2 size={14} className="text-terracotta shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/#engage"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-charcoal hover:text-terracotta transition-colors group-hover:translate-x-1 transition-transform duration-300"
                  data-testid={`service-cta-${s.n}`}
                >
                  Initialize Project Brief <ArrowUpRight size={16} />
                </Link>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-24 bg-charcoal text-stone p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-xs shadow-2xl border border-white/10"
          >
            <div>
              <div className="label-caps text-terracotta-light mb-3 font-semibold">Ready to construct your masterpiece?</div>
              <h3 className="font-heading text-3xl md:text-5xl tracking-tighter leading-none max-w-2xl text-white">
                Explore what we can build for you.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join/client" className="btn-terra">Client Portal</Link>
              <Link href="/how-it-works" className="btn-ghost-dark text-white border-white/40 hover:bg-white hover:text-charcoal">How It Works</Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
