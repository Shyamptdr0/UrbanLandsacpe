import RegisterComponent from "@/components/auth/RegisterComponent";

export const metadata = {
  title: "Professional Registration | Urban Landscape",
  description: "Register your practice on Urban Landscape to access verified construction leads in your city.",
};

export default function ContractorRegisterPage() {
  return <RegisterComponent defaultTab="contractor" />;
}
