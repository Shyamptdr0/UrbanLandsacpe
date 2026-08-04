import Link from "next/link";
import { ShieldCheck, Award, MapPin, Mail, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="mt-28 border-t border-stone-alt bg-[#EAE7DF] font-sans">
      <div className="marketing-container py-16 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-charcoal grid place-items-center bg-white shadow-xs">
              <div className="w-1.5 h-1.5 bg-terracotta" />
            </div>
            <span className="font-heading tracking-tight text-xl font-medium text-charcoal">Urban Landscape</span>
          </div>
          <p className="mt-4 text-sm text-neutral-600 max-w-md leading-relaxed font-light">
            Central India’s premier architectural construction ecosystem — engineered on structural precision, radical transparency, and legacy craftsmanship.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-neutral-600 font-medium">
            <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-stone-300">
              <ShieldCheck size={13} className="text-terracotta" /> ISO 9001:2015
            </span>
            <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-stone-300">
              <Award size={13} className="text-terracotta" /> FE 550D TMT
            </span>
            <span className="inline-flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-full border border-stone-300 font-mono">
              M40 / M50 Grade
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="label-caps mb-4 text-charcoal font-semibold">Explore</div>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li><Link href="/about" className="hover:text-terracotta transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-terracotta transition-colors">Services Verticals</Link></li>
            <li><Link href="/projects" className="hover:text-terracotta transition-colors">Our Portfolio</Link></li>
            <li><Link href="/how-it-works" className="hover:text-terracotta transition-colors">Methodology</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="label-caps mb-4 text-charcoal font-semibold">Portals</div>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li><Link href="/join/client" className="hover:text-terracotta transition-colors">For Clients</Link></li>
            <li><Link href="/join/contractor" className="hover:text-terracotta transition-colors">For Professionals</Link></li>
            <li><Link href="/login?tab=client" className="hover:text-terracotta transition-colors">Client Login</Link></li>
            <li><Link href="/login?tab=contractor" className="hover:text-terracotta transition-colors">Contractor Login</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="label-caps mb-4 text-charcoal font-semibold">Design Studio</div>
          <ul className="space-y-2.5 text-sm text-neutral-700 font-light">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-terracotta shrink-0" />
              <span>Vijay Nagar, Indore, M.P.</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-terracotta shrink-0" />
              <a href="mailto:sharadchaurasia@urbanlandscape.in" className="hover:text-terracotta transition-colors">sharadchaurasia@urbanlandscape.in</a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall size={15} className="text-terracotta shrink-0" />
              <a href="tel:+919827602453" className="hover:text-terracotta transition-colors">+91 98276 02453</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-alt bg-[#E2DFD6]">
        <div className="marketing-container py-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
          <div>© {new Date().getFullYear()} Urban Landscape Studio. All Rights Reserved.</div>
          <div className="marker-num font-mono text-[11px] text-neutral-500">
            Architectural Engineering · Escrow Protection · 10-Year Warranty
          </div>
        </div>
      </div>
    </footer>
  );
}
