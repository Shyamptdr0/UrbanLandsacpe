"use client";

import { useState } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Calendar,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CONTACT_ITEMS = [
  {
    type: "General Inquiry",
    value: "contact@urbanlandscape.in",
    desc: "For general questions & inquiries.",
    icon: Mail,
    href: "mailto:contact@urbanlandscape.in",
  },
  {
    type: "Direct Consultation",
    value: "contact@urbanlandscape.in",
    desc: "Principal Architects & Design Team",
    icon: Mail,
    href: "mailto:contact@urbanlandscape.in",
  },
  {
    type: "Direct Communication",
    value: "+91 98276 02453",
    desc: "Available Mon–Sat, 9:00 AM – 7:00 PM IST.",
    icon: Phone,
    href: "tel:+919827602453",
  },
  {
    type: "Design Studio",
    value: "1641, Scheme No. 114 Part I",
    desc: "Vijay Nagar, Indore, Madhya Pradesh 452010",
    icon: MapPin,
    href: "https://maps.google.com/?q=Vijay+Nagar+Indore",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectInterest: "End-to-End Construction",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Book a Meeting modal state
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/inquiries", {
        first_name: formData.name,
        last_name: `[Interest: ${formData.projectInterest}]`,
        email: formData.email,
        details: `Contact Form Message:\nPhone: ${formData.phone}\nInterest: ${formData.projectInterest}\nMessage: ${formData.message}`,
      });
      toast.success("Message transmitted successfully! Our design principals will respond within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectInterest: "End-to-End Construction",
        message: "",
      });
    } catch {
      toast.error("Failed to transmit message. Please call us directly at +91 98276 02453.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await api.post("/inquiries", {
        first_name: bookingForm.name,
        last_name: `[Contact Page Booking: ${bookingForm.meetingType}]`,
        email: bookingForm.email,
        details: `Meeting Consultation Request:\nPhone: ${bookingForm.phone}\nType: ${bookingForm.meetingType}\nPreferred Date: ${bookingForm.date}\nTime Slot: ${bookingForm.timeSlot}\nProject Scope: ${bookingForm.projectType}\nNotes: ${bookingForm.notes}`,
      });
      toast.success("Meeting request submitted! Our team will confirm your consultation slot within 2 hours.");
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
                <Sparkles size={14} className="text-[#A14732]" /> Connect with Excellence
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                Let’s{" "}
                <span className="italic font-serif font-normal text-[#053c63]">Conceptualize</span>.
              </h1>

              <p className="mt-4 text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                Our studio operates at the intersection of civil engineering precision and architectural artistry. Reach out to our design principals for project inquiries or book a personal consultation.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#contact-form"
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#A14732] transition-all shadow-md"
                >
                  Send Inquiry Brief
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

        {/* MAIN INQUIRY FORM SECTION (CENTERED) */}
        <section id="contact-form" className="w-full pt-16 md:pt-24 pb-14 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF]">
          <div className="max-w-4xl mx-auto">
            {/* START A DIALOGUE INTERACTIVE FORM */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-[#1A1A1A] text-white p-8 sm:p-12 md:p-14 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle architectural grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="relative z-10 space-y-8">
                <div className="space-y-2 border-b border-white/10 pb-6 text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A14732] font-semibold">
                    <Send size={14} /> Project Inquiry Form
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
                    Start a <span className="italic font-serif font-normal text-[#A14732]">Dialogue</span>.
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
                    Please provide your project details below. Our design principals review every inquiry personally within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Full Identity *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Digital Address (Email) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Project Interest *
                      </label>
                      <select
                        value={formData.projectInterest}
                        onChange={(e) => setFormData({ ...formData, projectInterest: e.target.value })}
                        className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#A14732] transition-colors cursor-pointer"
                      >
                        <option value="End-to-End Construction">End-to-End Construction</option>
                        <option value="Bespoke Interior Design">Bespoke Interior Design</option>
                        <option value="Premium Renovation">Premium Renovation</option>
                        <option value="Architectural Consultancy">Architectural Consultancy</option>
                        <option value="Contractor / Partner Inquiry">Contractor / Partner Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      The Vision / Project Scope *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your architectural aspirations, plot size, location, or timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#A14732] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#053c63] hover:bg-[#8e3e2b] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Message...
                      </>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* CONTACT DETAILS IN ONE LINE OF BOXES BELOW */}
          <div className="mt-16 md:mt-24 max-w-7xl mx-auto">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 label-caps text-[#A14732] font-semibold text-xs tracking-widest uppercase mb-2">
                <Sparkles size={14} /> Direct Engagement
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                Studio & <span className="italic font-serif font-normal text-[#A14732]">Concierge</span>.
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base font-light mt-1">
                Reach out to our design concierge, principals, or visit our central Indore studio.
              </p>
            </div>

            {/* A SINGLE HORIZONTAL ROW OF BOXES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Box 1: General Inquiry */}
              <a
                href="mailto:contact@urbanlandscape.in"
                className="bg-[#1A1A1A] text-white p-6 sm:p-7 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#A14732]/60 hover:bg-[#202020] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732] mb-5 group-hover:scale-110 group-hover:bg-[#A14732]/20 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-[#A14732] tracking-wider">
                    General Inquiries
                  </p>
                  <p className="text-base font-bold text-white tracking-tight mt-1 truncate group-hover:text-white">
                    contact@urbanlandscape.in
                  </p>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Questions, press & initial brief
                  </p>
                </div>
              </a>

              {/* Box 2: Direct Leadership Emails */}
              <a
                href="mailto:contact@urbanlandscape.in"
                className="bg-[#1A1A1A] text-white p-6 sm:p-7 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#A14732]/60 hover:bg-[#202020] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732] mb-5 group-hover:scale-110 group-hover:bg-[#A14732]/20 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-[#A14732] tracking-wider">
                    Direct Contact
                  </p>
                  <p className="text-base font-bold text-white tracking-tight mt-1 truncate group-hover:text-white">
                    contact@urbanlandscape.in
                  </p>
                  <p className="text-xs text-neutral-400 font-light mt-1 truncate">
                    Leadership & Design Team
                  </p>
                </div>
              </a>

              {/* Box 3: Phone Concierge */}
              <a
                href="tel:+919827602453"
                className="bg-[#1A1A1A] text-white p-6 sm:p-7 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#A14732]/60 hover:bg-[#202020] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732] mb-5 group-hover:scale-110 group-hover:bg-[#A14732]/20 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-[#A14732] tracking-wider">
                    Direct Phone
                  </p>
                  <p className="text-base font-bold text-white tracking-tight mt-1 group-hover:text-white">
                    +91 98276 02453
                  </p>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Mon–Sat, 9:00 AM – 7:00 PM IST
                  </p>
                </div>
              </a>

              {/* Box 4: Design Studio Location */}
              <a
                href="https://maps.google.com/?q=Vijay+Nagar+Indore"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A1A1A] text-white p-6 sm:p-7 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#A14732]/60 hover:bg-[#202020] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A14732] mb-5 group-hover:scale-110 group-hover:bg-[#A14732]/20 transition-transform">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-[#A14732] tracking-wider">
                    Design Studio
                  </p>
                  <p className="text-base font-bold text-white tracking-tight mt-1 group-hover:text-white">
                    Vijay Nagar, Indore
                  </p>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    1641, Scheme No. 114 Part I, MP 452010
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ZERO RISK CONSULTATION BANNER - SAME CONSISTENT COMPONENT */}
        <section className="w-full pb-28 pt-12 px-6 sm:px-8 lg:px-12 bg-[#F4F3EF]">
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
                  Prefer a direct architectural consultation?
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
