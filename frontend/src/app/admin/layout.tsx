import AdminGuard from "@/common/guards/AdminGuard";
import AdminLayout from "@/modules/admin/layout/components/AdminLayout";

export const metadata = {
  title: "StoryVN Admin Portal - Tổng quan hệ thống",
  description: "Cổng quản trị tổng quan, tác giả, người dùng và tài chính StoryVN.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}

