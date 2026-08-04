"use client";
import { useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  const [f, setF] = useState({ first_name: "", last_name: "", email: "", details: "" });
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/inquiries", f); toast.success("Message sent."); setF({ first_name: "", last_name: "", email: "", details: "" }); }
    catch { toast.error("Something went wrong."); }
  };
  return (
    <div className="bg-[#F4F3EF]">
      <Navbar />
      <section className="marketing-container pt-16 pb-24 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <div className="label-caps mb-6">Contact</div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-tighter leading-[0.95]">Reach the <span className="italic font-normal">studio.</span></h1>
          <div className="mt-10 space-y-6">
            <Info label="Email" value="sharadchaurasia@urbanlandscape.in" />
            <Info label="Phone" value="+91 98276 02453" />
            <Info label="Studio" value="Vijay Nagar, Indore" />
          </div>
        </div>
        <form onSubmit={submit} className="md:col-span-7 bg-white border border-stone-alt p-8 md:p-10">
          <div className="label-caps mb-2">Direct Engagement</div>
          <div className="font-heading text-3xl tracking-tight">Send a message</div>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <F label="First Name"><Input required value={f.first_name} onChange={(e) => setF({ ...f, first_name: e.target.value })} data-testid="c-first" /></F>
            <F label="Last Name"><Input required value={f.last_name} onChange={(e) => setF({ ...f, last_name: e.target.value })} data-testid="c-last" /></F>
            <div className="md:col-span-2"><F label="Email"><Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} data-testid="c-email" /></F></div>
            <div className="md:col-span-2"><F label="Message"><Textarea rows={5} required value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} data-testid="c-msg" /></F></div>
          </div>
          <button type="submit" className="btn-terra mt-8" data-testid="c-submit">Send <ArrowUpRight size={16} /></button>
        </form>
      </section>
      <Footer />
    </div>
  );
}
const Info = ({ label, value }) => (
  <div className="border-t border-stone-alt pt-4"><div className="label-caps">{label}</div><div className="mt-1 text-lg">{value}</div></div>
);
const F = ({ label, children }) => (<label className="block"><div className="label-caps mb-2">{label}</div>{children}</label>);
