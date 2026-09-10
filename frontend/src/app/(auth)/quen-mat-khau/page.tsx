import { HomeView } from "@/modules/client/home/components/HomeView";

export default function QuenMatKhauPage() {
  return <HomeView initialAuthMode="forgot-password" initialOpen={true} />;
}
