"use client";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

const smoothEase = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } },
};

const STEPS = [
  {
    n: "01",
    t: "Strategic Discovery & Consultation",
    d: "A comprehensive initial dialogue to analyze site conditions, zoning guidelines, architectural preferences, and target budget parameters.",
    deliverable: "3D Site Analysis & Feasibility Outline",
  },
  {
    n: "02",
    t: "3D BIM Visualization & Line-Item BOQ",
    d: "Photo-realistic 3D walkthroughs, structural load blueprints, and line-item material cost estimates delivered within 7 business days.",
    deliverable: "Fixed-Budget Estimate & Architectural Blueprints",
  },
  {
    n: "03",
    t: "Escrow Protected Contracting",
    d: "Digital contract agreement signed between client, principal architect, and contractor with milestone-gated escrow disbursements.",
    deliverable: "Legally Protected Milestone Schedule",
  },
  {
    n: "04",
    t: "Stage-by-Stage Precision Execution",
    d: "Daily site log uploads, slump test reports, stage-by-stage photo logs, and required admin quality sign-offs before funds release.",
    deliverable: "Live Progress Portal & Verified Stage Log",
  },
  {
    n: "05",
    t: "Certified Legacy Handover",
    d: "Thorough snag-list audit closure, formal legal handover of structural warranty documents, and post-occupancy care commitment.",
    deliverable: "10-Year Structural Warranty Certificate",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-[#F4F3EF] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="marketing-container pt-20 pb-28">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="inline-flex items-center gap-2 label-caps text-terracotta mb-4 font-semibold">
              <Sparkles size={14} /> Methodology & Framework
            </div>
            <h1 className="font-heading text-5xl md:text-7xl tracking-tighter leading-[0.95] max-w-4xl text-charcoal">
              A transparent path from <span className="italic font-normal text-terracotta">sketch</span> to <span className="italic font-normal text-terracotta">legacy.</span>
            </h1>
            <p className="mt-6 text-neutral-600 max-w-2xl text-base md:text-lg leading-relaxed font-light">
              Our building framework removes ambiguity from architectural construction. Every single phase has a concrete deliverable, a digital audit document, and a verified decision-maker.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-20 grid md:grid-cols-12 gap-6"
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="md:col-span-12 grid md:grid-cols-12 items-start border-t border-stone-alt pt-8 pb-8 hover:bg-white p-6 transition-all duration-300 rounded-xs group shadow-xs hover:shadow-md"
              >
                <div className="md:col-span-2 marker-num text-terracotta text-2xl font-bold font-mono">{s.n}</div>
                <div className="md:col-span-5 font-heading text-2xl md:text-3xl tracking-tight leading-tight text-charcoal group-hover:text-terracotta transition-colors duration-300">
                  {s.t}
                </div>
                <div className="md:col-span-5 space-y-3 md:pt-1">
                  <div className="text-sm text-neutral-600 leading-relaxed font-light">{s.d}</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    <CheckCircle2 size={13} className="text-terracotta" />
                    <span>Deliverable: {s.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-24 bg-charcoal text-stone p-10 md:p-14 rounded-xs border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-2 label-caps text-terracotta-light mb-2 font-semibold">
                <ShieldCheck size={14} /> Zero Risk Contracting
              </div>
              <h3 className="font-heading text-3xl md:text-4xl tracking-tight text-white">Initialize your project consultation today.</h3>
            </div>
            <Link href="/#engage" className="btn-terra whitespace-nowrap">
              Submit Project Brief <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
