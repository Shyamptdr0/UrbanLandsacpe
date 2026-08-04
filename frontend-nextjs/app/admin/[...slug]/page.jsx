"use client";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import AdminLoginComponent from "@/components/auth/AdminLoginComponent";

export default function AdminSubPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-neutral-500">Loading…</div>;

  if (!user || user.role !== "admin") {
    return <AdminLoginComponent />;
  }

  return <AdminDashboard />;
}
