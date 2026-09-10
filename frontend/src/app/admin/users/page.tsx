import AdminUsersPage from "@/modules/admin/users/components/AdminUsersPage";

export const metadata = {
  title: "Quản lý Người dùng & Tác giả | StoryVN Admin Portal",
  description: "Danh sách tài khoản độc giả, tác giả sáng tác, phân quyền và kiểm duyệt StoryVN.",
};

export default function AdminUsersRoutePage() {
  return <AdminUsersPage />;
}
