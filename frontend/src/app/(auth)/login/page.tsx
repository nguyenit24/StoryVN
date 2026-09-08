import { HomeView } from "@/components/home/HomeView";

export default function LoginPage() {
  return <HomeView initialAuthMode="login" initialOpen={true} />;
}
