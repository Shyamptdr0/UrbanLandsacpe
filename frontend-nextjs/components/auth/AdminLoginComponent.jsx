"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ShieldAlert } from "lucide-react";

export default function AdminLoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      if (u.role !== "admin") {
        toast.error("Access denied. Admin account required.");
      } else {
        toast.success("Welcome Admin.");
        router.push("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid admin credentials");
    }
    setBusy(false);
  };

  return (
    <div className="bg-[#F4F3EF] min-h-screen">
      <Navbar />
      <section className="marketing-container py-20 flex justify-center">
        <form onSubmit={submit} className="w-full max-w-md bg-white border border-stone-alt p-8 md:p-10 shadow-xl" data-testid="admin-login-form">
          <div className="flex items-center gap-2 text-terracotta mb-2">
            <ShieldAlert size={20} />
            <div className="label-caps text-terracotta">Restricted Access</div>
          </div>
          <div className="font-heading text-3xl tracking-tight">Admin Console</div>
          <p className="text-sm text-neutral-600 mt-2 mb-8">
            Please enter your administrator credentials to proceed.
          </p>

          <div className="grid gap-5">
            <label className="block">
              <div className="label-caps mb-2">Admin Email</div>
              <Input type="email" required autoComplete="email" data-testid="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <div className="label-caps mb-2">Password</div>
              <Input type="password" required autoComplete="current-password" data-testid="admin-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>

          <button type="submit" disabled={busy} className="btn-terra mt-8 w-full justify-center" data-testid="admin-login-submit">
            {busy ? "Authenticating..." : "Login to Console"} <LogIn size={16} />
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}
