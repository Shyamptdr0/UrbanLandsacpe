"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/ui/Logo";

const NAV = [
  { to: "/projects", label: "Our Projects" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/services", label: "Services" },
  { to: "/cost-estimator", label: "Cost Estimator" },
];

export default function Navbar({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const timeoutRef = useRef(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMoreOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 200);
  };

  return (
    <header
      data-testid="site-navbar"
      className={`${
        overlay
          ? "absolute inset-x-0 top-0 z-40 bg-transparent border-b border-white/10"
          : "sticky top-0 z-40 backdrop-blur-xl bg-[#F4F3EF]/90 border-b border-stone-200/70"
      }`}
    >
      <div className="marketing-container flex items-center justify-between h-20">
        <Link href="/" data-testid="brand-link" className="group flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-105 ${
              overlay
                ? "bg-white/10 backdrop-blur-md border border-white/20 p-1.5 group-hover:bg-[#053c63] group-hover:border-[#053c63] group-hover:shadow-[0_0_20px_rgba(5,60,99,0.7)]"
                : "bg-[#053c63] p-1.5 shadow-xs group-hover:bg-[#074b7a] group-hover:shadow-md"
            }`}
          >
            <Logo className="w-full h-full text-white transition-colors duration-200" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-heading tracking-tight text-[20px] font-semibold leading-tight transition-colors duration-200 ${
                overlay
                  ? "text-white drop-shadow-sm group-hover:text-white"
                  : "text-[#1A1A1A] group-hover:text-[#053c63]"
              }`}
            >
              Urban Landscape
            </span>
            <span
              className={`text-[8.5px] uppercase tracking-[0.2em] font-medium leading-none mt-0.5 transition-colors duration-200 ${
                overlay
                  ? "text-white/70 group-hover:text-white/90"
                  : "text-neutral-500 group-hover:text-[#053c63]/80"
              }`}
            >
              Designing Better Futures
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => {
            const isActive = pathname === n.to;
            return (
              <Link
                key={n.to}
                href={n.to}
                data-testid={`nav-${n.to.replace("/", "")}`}
                className={`group relative text-sm font-medium transition-colors duration-300 ease-out py-1 ${
                  overlay
                    ? isActive
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white"
                    : isActive
                    ? "text-[#053c63] font-semibold"
                    : "text-neutral-700 hover:text-[#053c63]"
                }`}
              >
                {n.label}
                {/* ANIMATED BOTTOM LINE ON HOVER & ACTIVE */}
                <span
                  className={`absolute left-0 -bottom-[3px] h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    overlay ? "bg-white" : "bg-[#053c63]"
                  } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}

          {/* MORE DROPDOWN (GLITCH-FREE SHADCN UI DROPDOWN ON HOVER & CLICK) */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <DropdownMenu modal={false} open={moreOpen} onOpenChange={setMoreOpen}>
              <DropdownMenuTrigger
                data-testid="nav-more"
                className={`group relative text-sm font-medium transition-colors duration-300 ease-out flex items-center gap-1.5 py-1 outline-none cursor-pointer select-none ${
                  overlay
                    ? "text-white/80 hover:text-white"
                    : "text-neutral-700 hover:text-[#053c63]"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    moreOpen ? "rotate-180 text-[#053c63]" : ""
                  }`}
                />
                {/* ANIMATED BOTTOM LINE ON HOVER & OPEN */}
                <span
                  className={`absolute left-0 -bottom-[3px] h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    overlay ? "bg-white" : "bg-[#053c63]"
                  } ${moreOpen ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={10}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl w-60 p-2 shadow-2xl transition-all duration-200 z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Portals & Access
                </div>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-xl hover:bg-neutral-100/90 focus:bg-neutral-100/90 transition-colors p-2.5 text-sm font-medium"
                >
                  <Link
                    href="/login?tab=client"
                    data-testid="menu-client-login"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-neutral-800">Login as Client</span>
                    <ArrowRight size={14} className="text-neutral-400" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-xl hover:bg-neutral-100/90 focus:bg-neutral-100/90 transition-colors p-2.5 text-sm font-medium"
                >
                  <Link
                    href="/login?tab=contractor"
                    data-testid="menu-contractor-login"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-neutral-800">Login as Contractor</span>
                    <ArrowRight size={14} className="text-neutral-400" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5 bg-neutral-200/70" />

                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Company
                </div>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-xl hover:bg-neutral-100/90 focus:bg-neutral-100/90 transition-colors p-2.5 text-sm font-medium"
                >
                  <Link
                    href="/about"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-neutral-800">About Us</span>
                    <ArrowRight size={14} className="text-neutral-400" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-xl hover:bg-neutral-100/90 focus:bg-neutral-100/90 transition-colors p-2.5 text-sm font-medium"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-neutral-800">Contact</span>
                    <ArrowRight size={14} className="text-neutral-400" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button
          data-testid="mobile-menu-toggle"
          className={`md:hidden p-2 rounded-lg ${
            overlay ? "text-white hover:bg-white/10" : "text-neutral-800 hover:bg-neutral-200/50"
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU ACCORDION */}
      {open && (
        <div
          className={`md:hidden border-t ${
            overlay
              ? "border-white/20 bg-black/80 backdrop-blur-2xl text-white"
              : "border-stone-200/80 bg-[#F4F3EF] text-[#1A1A1A]"
          }`}
        >
          <div className="marketing-container py-5 space-y-3">
            {NAV.map((n) => {
              const isActive = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium py-1.5 transition-colors ${
                    isActive ? "text-[#053c63] font-bold" : "hover:text-[#053c63]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-neutral-200/60 space-y-2">
              <Link
                href="/login?tab=client"
                onClick={() => setOpen(false)}
                className="block text-sm py-1 font-medium hover:text-[#053c63]"
              >
                Login as Client
              </Link>
              <Link
                href="/login?tab=contractor"
                onClick={() => setOpen(false)}
                className="block text-sm py-1 font-medium hover:text-[#053c63]"
              >
                Login as Contractor
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="block text-sm py-1 font-medium hover:text-[#053c63]"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block text-sm py-1 font-medium hover:text-[#053c63]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
