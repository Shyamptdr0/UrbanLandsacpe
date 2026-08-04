"use client";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { motion } from "framer-motion";
import { Sparkles, Building2, ShieldCheck, Award, Layers, CheckCircle2, Compass, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const smoothEase = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } },
};

const PRINCIPLES = [
  {
    title: "Radical Transparency",
    desc: "Every line-item estimate, material invoice, and stage sign-off is digitized and accessible to clients and contractors in real time.",
  },
  {
    title: "Structural Rigor",
    desc: "We enforce lab-certified FE 550D steel and M40/M50 grade concrete protocols on every residential and commercial project.",
  },
  {
    title: "Protected Payouts",
    desc: "Contractors get guaranteed milestone payouts; clients pay only when stage work passes quality verification.",
  },
  {
    title: "10-Year Warranty",
    desc: "Every structure delivered is backed by formal structural warranty documentation and snag-list closure audits.",
  },
];

export default function About() {
  return (
    <div className="bg-[#F4F3EF] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <section className="marketing-container pt-20 pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="grid md:grid-cols-12 gap-12 md:gap-16 items-start"
          >
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-2 label-caps text-terracotta mb-4 font-semibold">
                <Sparkles size={14} /> About Studio & Philosophy
              </div>
              <h1 className="font-heading text-5xl md:text-7xl tracking-tighter leading-[0.95] text-charcoal">
                Legacy is not built by chance. <br />
                It is engineered with <span className="italic font-normal text-terracotta">discipline.</span>
              </h1>
            </div>

            <div className="md:col-span-7 space-y-6 text-neutral-700 leading-relaxed text-base md:text-lg font-light">
              <p>
                <strong className="font-medium text-charcoal">Urban Landscape</strong> was established with a singular mission: to eliminate opacity, cost overruns, and material compromises in modern Indian construction.
              </p>
              <p>
                Building a dream residence or commercial landmark should be an empowering experience. We unite visionary homeowners, principal architects, structural engineers, and verified contractors under a synchronized digital ecosystem.
              </p>
              <p>
                From structural steel testing in Central India to heritage interior retrofits, every phase of construction is versioned, recorded, and audited with unwavering precision.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-alt border border-stone-alt mt-12 shadow-sm rounded-xs overflow-hidden">
                <Stat n="120+" l="Landmark Homes" />
                <Stat n="45+" l="Cities Across MP" />
                <Stat n="₹280cr+" l="Project Value" />
                <Stat n="10 Year" l="Legal Warranty" />
              </div>
            </div>
          </motion.div>

          {/* Core Principles */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-28"
          >
            <div className="label-caps mb-3 text-terracotta font-semibold">Guiding Standards</div>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tighter text-charcoal">
              Our Core <span className="italic font-normal text-terracotta">Principles.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              {PRINCIPLES.map((p, idx) => (
                <div
                  key={p.title}
                  className="bg-white border border-stone-alt p-8 hover-lift rounded-xs flex items-start gap-5 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-1">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-charcoal">{p.title}</h3>
                    <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pillars Grid */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mt-20 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-white border border-stone-alt p-8 hover-lift rounded-xs">
              <Building2 className="text-terracotta mb-4" size={28} />
              <h3 className="font-heading text-2xl font-semibold text-charcoal">Architectural Mastery</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Combining timeless aesthetics with 3D BIM structural calculations for enduring architectural strength.
              </p>
            </div>

            <div className="bg-white border border-stone-alt p-8 hover-lift rounded-xs">
              <ShieldCheck className="text-terracotta mb-4" size={28} />
              <h3 className="font-heading text-2xl font-semibold text-charcoal">Certified Standards</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                ISO 9001 certified protocols with FE 550D steel and lab-tested M40/M50 concrete specifications.
              </p>
            </div>

            <div className="bg-white border border-stone-alt p-8 hover-lift rounded-xs">
              <Award className="text-terracotta mb-4" size={28} />
              <h3 className="font-heading text-2xl font-semibold text-charcoal">Legacy Handover</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Comprehensive 10-year structural warranty backed by milestone-verified escrow disbursements.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const Stat = ({ n, l }) => (
  <div className="bg-[#F4F3EF] p-6 hover:bg-white transition-all duration-300 group">
    <div className="font-heading text-3xl md:text-4xl tracking-tighter text-charcoal group-hover:text-terracotta transition-colors marker-num font-mono">{n}</div>
    <div className="label-caps mt-2 text-neutral-500 text-[10px]">{l}</div>
  </div>
);
