/**
 * Chuyển đổi đường dẫn ảnh tương đối (từ backend local uploads) hoặc tuyệt đối (Cloudinary)
 * thành URL hợp lệ mà trình duyệt có thể hiển thị.
 */
export const getFullImageUrl = (path?: string | null): string => {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  // Nếu là URL tuyệt đối hoặc base64 data URL thì giữ nguyên
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Nếu là đường dẫn tương đối (ví dụ: /uploads/avatars/abc.png hoặc uploads/avatars/abc.png)
  const backendBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:3000";

  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${backendBase}${cleanPath}`;
};
