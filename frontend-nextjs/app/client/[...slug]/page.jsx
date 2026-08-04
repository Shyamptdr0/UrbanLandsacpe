"use client";
import RoleRoute from "@/components/auth/RoleRoute";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function ClientSubPage() {
  return (
    <RoleRoute role="client">
      <ClientDashboard />
    </RoleRoute>
  );
}
