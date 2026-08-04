"use client";
import RoleRoute from "@/components/auth/RoleRoute";
import ContractorDashboard from "@/components/dashboard/ContractorDashboard";

export default function ContractorSubPage() {
  return (
    <RoleRoute role="contractor">
      <ContractorDashboard />
    </RoleRoute>
  );
}
