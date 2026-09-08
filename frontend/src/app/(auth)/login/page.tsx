import { HomeView } from "@/modules/client/home/components/HomeView";

export default function LoginPage() {
  return <HomeView initialAuthMode="login" initialOpen={true} />;
}
