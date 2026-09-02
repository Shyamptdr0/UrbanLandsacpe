import RegisterComponent from "@/components/auth/RegisterComponent";

export const metadata = {
  title: "Register | Urban Landscape",
  description: "Join Urban Landscape as a client or verified professional partner.",
};

export default function RegisterPage() {
  return <RegisterComponent defaultTab="client" />;
}
