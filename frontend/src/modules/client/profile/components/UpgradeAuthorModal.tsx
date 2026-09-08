"use client";

import React, { useState } from "react";
import { authorApi } from "@/lib/api/author";
import { authApi } from "@/lib/api/auth";
import { setTokens, setStoredUser } from "@/lib/auth/token";
import { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

interface UpgradeAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
  currentUser: User | null;
}

const SUGGESTED_GENRES = [
  "Tiên Hiệp",
  "Huyền Huyễn",
  "Đô Thị",
  "Dị Giới",
  "Trọng Sinh",
  "Võng Du",
  "Ngôn Tình",
  "Trinh Thám",
];

export const UpgradeAuthorModal: React.FC<UpgradeAuthorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}) => {
  const { login } = useAuth();
  const [penName, setPenName] = useState(
    currentUser?.displayName || currentUser?.username || ""
  );
  const [writingStyle, setWritingStyle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isAgreed, setIsAgreed] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectGenre = (genre: string) => {
    if (!writingStyle) {
      setWritingStyle(genre);
    } else if (!writingStyle.includes(genre)) {
      setWritingStyle(`${writingStyle}, ${genre}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedPenName = penName.trim();
    if (!trimmedPenName) {
      setErrorMessage("Vui lòng nhập bút danh tác giả");
      return;
    }

    if (trimmedPenName.length < 2 || trimmedPenName.length > 50) {
      setErrorMessage("Bút danh phải từ 2 đến 50 ký tự");
      return;
    }

    if (!isAgreed) {
      setErrorMessage("Bạn cần đồng ý với Quy định tác quyền và thỏa thuận xuất bản");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authorApi.upgradeToAuthor({
        penName: trimmedPenName,
        writingStyle: writingStyle.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
      });

      if (res.success && res.data?.tokens) {
        // 1. Lưu token mới có role AUTHOR và đồng bộ AuthContext
        await login(res.data.tokens.accessToken, res.data.tokens.refreshToken);

        // 2. Đồng bộ lại profile mới nhất từ DB
        try {
          const meRes = await authApi.getMe();
          if (meRes.success && meRes.data?.user) {
            const fullUser: User = {
              ...meRes.data.user,
              id: meRes.data.user._id || meRes.data.user.id,
              role: "AUTHOR",
            };
            setStoredUser(fullUser);
            onSuccess(fullUser);
          } else {
            const fallbackUser: User = {
              ...(currentUser || { username: "author", email: "" }),
              role: "AUTHOR",
              authorProfile: {
                penName: trimmedPenName,
                writingStyle: writingStyle.trim(),
              },
            };
            setStoredUser(fallbackUser);
            onSuccess(fallbackUser);
          }
        } catch {
          const fallbackUser: User = {
            ...(currentUser || { username: "author", email: "" }),
            role: "AUTHOR",
            authorProfile: {
              penName: trimmedPenName,
              writingStyle: writingStyle.trim(),
            },
          };
          setStoredUser(fallbackUser);
          onSuccess(fallbackUser);
        }

        onClose();
      } else {
        setErrorMessage(res.message || "Nâng cấp lên tác giả thất bại. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message ||
          "Không thể hoàn tất nâng cấp tác giả. Vui lòng kiểm tra lại bút danh hoặc thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-scaleUp">
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/20">
                ✍️
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Đăng Ký Trở Thành Tác Giả
                </h3>
                <p className="text-xs text-slate-500">
                  Gia nhập đội ngũ tác giả sáng tác văn học kỳ ảo tại StoryVN
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pen Name */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Bút danh sáng tác <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 text-sm">✍️</span>
              <input
                type="text"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                placeholder="vd: Bạch Ngọc Đường, Tiêu Dao Tử, Thiên Tầm Tuyết..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Bút danh sẽ xuất hiện trên bìa truyện và trang tác giả của bạn.
            </p>
          </div>

          {/* Writing Style */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Thể loại / Phong cách sở trường
            </label>
            <input
              type="text"
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              placeholder="vd: Tiên hiệp hài hước, sảng văn, combat chân thực..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
            />
            {/* Suggested Genres Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Gợi ý nhanh:</span>
              {SUGGESTED_GENRES.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  onClick={() => handleSelectGenre(genre)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[10px] font-medium transition-colors cursor-pointer"
                >
                  +{genre}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Ảnh bìa trang tác giả (Tùy chọn)
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Dán đường dẫn URL ảnh bìa (hoặc để trống dùng mặc định)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-blue-500 text-xs"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-amber-900 leading-relaxed">
                Tôi đồng ý tuân thủ <b>Quy định kiểm duyệt nội dung</b> và{" "}
                <b>Chính sách nhuận bút</b> của StoryVN. Tôi cam kết tác phẩm xuất bản
                thuộc quyền tác giả hợp pháp.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý nâng cấp...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận Nâng Cấp Tác Giả</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
