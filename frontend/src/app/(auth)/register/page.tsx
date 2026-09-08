import { HomeView } from "@/modules/client/home/components/HomeView";

export default function RegisterPage() {
  return <HomeView initialAuthMode="register" initialOpen={true} />;
}
