import AdminUsersPage from "@/modules/admin/users/components/AdminUsersPage";

export const metadata = {
  title: "Quản Lý Người Dùng | StoryVN Admin",
  description: "Trang quản trị danh sách người dùng và phân quyền hệ thống StoryVN.",
};

export default function AdminPage() {
  return <AdminUsersPage />;
}
