"use client";
import RoleRoute from "@/components/auth/RoleRoute";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function ClientPage() {
  return (
    <RoleRoute role="client">
      <ClientDashboard />
    </RoleRoute>
  );
}
