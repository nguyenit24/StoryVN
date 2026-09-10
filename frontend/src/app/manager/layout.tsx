import ManagerGuard from "@/common/guards/ManagerGuard";
import ManagerLayout from "@/modules/manager/layout/components/ManagerLayout";

export const metadata = {
  title: "StoryVN Manager Portal - Quản lý nội dung",
  description: "Cổng biên tập và quản lý tác phẩm, thể loại, nhãn tag StoryVN.",
};

export default function ManagerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagerGuard>
      <ManagerLayout>{children}</ManagerLayout>
    </ManagerGuard>
  );
}
