import { HomeView } from "@/modules/client/home/components/HomeView";

export default function ForgotPasswordPage() {
  return <HomeView initialAuthMode="forgot-password" initialOpen={true} />;
}
