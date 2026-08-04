"use client";
import { useMemo, useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RATES = {
  "Design & Drawing": { standard: 45, premium: 85, luxury: 140 },
  "Renovation": { standard: 900, premium: 1600, luxury: 2600 },
  "End-to-End Construction": { standard: 1750, premium: 2400, luxury: 3500 },
};

const fmt = (n) => "₹ " + Math.round(n).toLocaleString("en-IN");

export default function CostEstimator() {
  const [type, setType] = useState("End-to-End Construction");
  const [area, setArea] = useState(1500);
  const [finish, setFinish] = useState("premium");

  const est = useMemo(() => {
    const rate = RATES[type][finish];
    const base = rate * Number(area || 0);
    return { low: base * 0.92, high: base * 1.12, rate };
  }, [type, area, finish]);

  return (
    <div className="bg-[#F4F3EF]">
      <Navbar />
      <section className="marketing-container pt-16 pb-24 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <div className="label-caps mb-6">Cost Estimator</div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-tighter leading-[0.95]">
            Know your <span className="italic font-normal">number</span> before you build.
          </h1>
          <p className="mt-6 text-neutral-600 max-w-md">A directional range based on current material and labour rates in Indore/Pune/Jaipur. Site conditions and design complexity will refine the final estimate.</p>
        </div>

        <div className="md:col-span-7 bg-white border border-stone-alt p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-6">
            <F label="Project Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger data-testid="est-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design & Drawing">Design & Drawing</SelectItem>
                  <SelectItem value="Renovation">Renovation</SelectItem>
                  <SelectItem value="End-to-End Construction">End-to-End Construction</SelectItem>
                </SelectContent>
              </Select>
            </F>
            <F label="Built-up Area (sq.ft)"><Input type="number" data-testid="est-area" value={area} onChange={(e) => setArea(e.target.value)} /></F>
            <F label="Finish Level">
              <Select value={finish} onValueChange={setFinish}>
                <SelectTrigger data-testid="est-finish"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </F>
          </div>
          <div className="mt-10 border-t border-stone-alt pt-8">
            <div className="label-caps text-neutral-500">Estimated Range</div>
            <div className="font-heading text-5xl md:text-6xl tracking-tighter mt-3" data-testid="est-range">
              {fmt(est.low)} <span className="text-neutral-400">—</span> {fmt(est.high)}
            </div>
            <div className="text-xs text-neutral-500 mt-4 marker-num">Rate applied: {fmt(est.rate)} / sq.ft · Finish: {finish}</div>
            <div className="mt-8 flex gap-3">
              <Link href="/join/client" className="btn-terra" data-testid="est-cta">Get a precise quote</Link>
              <Link href="/services" className="btn-ghost-dark">See services</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const F = ({ label, children }) => (
  <label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>
);
