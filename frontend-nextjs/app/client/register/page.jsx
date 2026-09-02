import RegisterComponent from "@/components/auth/RegisterComponent";

export const metadata = {
  title: "Client Registration | Urban Landscape",
  description: "Register as a client on Urban Landscape to connect with vetted architects and contractors.",
};

export default function ClientRegisterPage() {
  return <RegisterComponent defaultTab="client" />;
}
