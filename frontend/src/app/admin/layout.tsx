import AdminGuard from "@/common/guards/AdminGuard";

export const metadata = {
  title: "Quản trị Hệ thống | StoryVN Admin Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
