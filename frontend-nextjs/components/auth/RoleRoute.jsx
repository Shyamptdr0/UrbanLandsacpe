"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAllowed = user && user.role === role;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const loginDest = role === "client" ? "/client/login" : role === "contractor" ? "/contractor/login" : "/admin";
        router.replace(loginDest);
      } else if (!isAllowed) {
        const dest = user.role === "admin" ? "/admin" : user.role === "client" ? "/client" : "/contractor";
        router.replace(dest);
      }
    }
  }, [user, loading, isAllowed, role, router]);

  if (loading) return <div className="p-10 text-neutral-500">Loading…</div>;
  if (!isAllowed) return null;

  return children;
}
