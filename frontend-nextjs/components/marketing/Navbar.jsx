"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/projects", label: "Our Projects" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/services", label: "Services" },
  { to: "/cost-estimator", label: "Cost Estimator" },
];

export default function Navbar({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header
      data-testid="site-navbar"
      className={`${overlay ? "absolute" : "sticky top-0"} inset-x-0 z-40 backdrop-blur-xl bg-[#F4F3EF]/85 border-b border-stone-alt`}
    >
      <div className="marketing-container flex items-center justify-between h-16">
        <Link href="/" data-testid="brand-link" className="flex items-center gap-3">
          <div className="w-6 h-6 border border-charcoal grid place-items-center">
            <div className="w-1.5 h-1.5 bg-terracotta" />
          </div>
          <span className="font-heading tracking-tight text-[17px] font-medium">Urban Landscape</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              data-testid={`nav-${n.to.replace("/", "")}`}
              className={`relative text-sm font-medium transition-colors duration-300 ease-out py-1 ${pathname === n.to ? "text-charcoal" : "text-neutral-600 hover:text-charcoal"
                }`}
            >
              {n.label}
              {pathname === n.to && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full transition-all duration-300" />
              )}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger data-testid="nav-more" className="text-sm font-medium text-neutral-600 hover:text-charcoal transition-colors duration-300 ease-out flex items-center gap-1">
              More <span className="text-xs">▾</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-stone-alt rounded-sm w-56 p-1 shadow-lg transition-all duration-200 ease-out">
              <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-150"><Link href="/login?tab=client" data-testid="menu-client-login">Login as Client</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-150"><Link href="/login?tab=contractor" data-testid="menu-contractor-login">Login as Contractor</Link></DropdownMenuItem>
              <DropdownMenuSeparator className="bg-stone-alt" />
              <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-150"><Link href="/about">About Us</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer transition-colors duration-150"><Link href="/contact">Contact</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <button data-testid="mobile-menu-toggle" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-stone-alt bg-[#F4F3EF]">
          <div className="marketing-container py-4 grid gap-3">
            {NAV.map((n) => <Link key={n.to} href={n.to} onClick={() => setOpen(false)} className="text-sm">{n.label}</Link>)}
            <Link href="/login?tab=client" onClick={() => setOpen(false)} className="text-sm">Login as Client</Link>
            <Link href="/login?tab=contractor" onClick={() => setOpen(false)} className="text-sm">Login as Contractor</Link>
          </div>
        </div>
      )}
    </header>
  );
}
