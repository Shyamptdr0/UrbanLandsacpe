"use client";
import RoleRoute from "@/components/auth/RoleRoute";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";

export default function ContractorPage() {
  return (
    <RoleRoute role="contractor">
      <ContractorDashboard />
    </RoleRoute>
  );
}
