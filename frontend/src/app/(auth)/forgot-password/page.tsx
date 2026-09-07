import { HomeView } from "@/components/home/HomeView";

export default function ForgotPasswordPage() {
  return <HomeView initialAuthMode="forgot-password" initialOpen={true} />;
}
