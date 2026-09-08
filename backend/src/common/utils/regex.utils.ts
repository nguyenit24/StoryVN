/**
 * Thoát (escape) các ký tự đặc biệt trong chuỗi để sử dụng an toàn khi tạo biểu thức chính quy (RegExp),
 * tránh lỗi cú pháp RegExp và ngăn chặn tấn công ReDoS (Regular Expression Denial of Service).
 *
 * @param str Chuỗi ký tự cần escape
 * @returns Chuỗi an toàn đã được escape các ký tự đặc biệt
 */
export function escapeRegex(str: string): string {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
