"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, UpdateProfileDto } from "@/types/auth";
import { ProfileService } from "../services/profile.service";
import { setStoredUser } from "@/common/utils/token";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { Alert } from "@/common/components/Alert";
import { getFullImageUrl } from "@/common/utils/imageUrl";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: (updatedUser: User) => void;
}

interface EditProfileFormProps {
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName || user.username || "");
  const [avatar, setAvatar] = useState(user.avatar || user.avatarUrl || "");
  const [bio, setBio] = useState(user.bio || "");
  const [facebook, setFacebook] = useState(user.socialLinks?.facebook || "");
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || "");

  useEffect(() => {
    setDisplayName(user.displayName || user.username || "");
    setAvatar(user.avatar || user.avatarUrl || "");
    setBio(user.bio || "");
    setFacebook(user.socialLinks?.facebook || "");
    setTwitter(user.socialLinks?.twitter || "");
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar upload via file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dung lượng dưới 10MB.");
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);

    try {
      const res = await ProfileService.uploadAvatar(file);
      if (res.success && res.data?.url) {
        setAvatar(res.data.url);
        setSuccessMsg("Tải ảnh lên thành công! Nhấn 'Lưu thay đổi' để hoàn tất.");
      } else {
        setError(res.message || "Không thể tải ảnh lên máy chủ.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Lỗi khi tải ảnh đại diện lên máy chủ. Vui lòng thử lại.";
      setError(errMsg || "Lỗi khi tải ảnh đại diện lên máy chủ.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const dto: UpdateProfileDto = {
      displayName: displayName.trim(),
      avatar: avatar.trim(),
      bio: bio.trim(),
      socialLinks: {
        facebook: facebook.trim(),
        twitter: twitter.trim(),
      },
    };

    try {
      const res = await ProfileService.updateProfile(dto);
      if (res.success && res.data?.user) {
        const updated = res.data.user;
        setStoredUser(updated);
        setSuccessMsg("Cập nhật hồ sơ thành công!");
        setTimeout(() => {
          onSuccess(updated);
          onClose();
        }, 800);
      } else {
        setError(res.message || "Không thể cập nhật hồ sơ cá nhân.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Đã có lỗi xảy ra khi lưu thay đổi. Vui lòng thử lại!";
      setError(errMsg || "Đã có lỗi xảy ra khi lưu thay đổi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            Chỉnh sửa hồ sơ cá nhân
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật tên hiển thị, ảnh đại diện và thông tin giới thiệu của bạn
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        {successMsg && (
          <Alert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg(null)}
          />
        )}

        {/* AVATAR UPLOAD & PREVIEW */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group shrink-0">
            {avatar ? (
              <img
                src={getFullImageUrl(avatar)}
                alt="Avatar Preview"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                onError={() => setAvatar("")}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
                {getInitials(displayName || user.username)}
              </div>
            )}

            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white text-xs font-bold">
                Đang tải...
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Ảnh đại diện
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hỗ trợ định dạng JPG, PNG, WEBP tối đa 10MB. Ảnh sẽ được tự động tối ưu hóa.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                id="avatar-upload-input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Chọn ảnh từ máy
              </Button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-medium transition-colors"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CUSTOM AVATAR URL INPUT */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Hoặc nhập liên kết ảnh trực tiếp (URL)
          </label>
          <Input
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* DISPLAY NAME */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Tên hiển thị độc giả <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={displayName}
            maxLength={50}
            onChange={(e) => setDisplayName(e.target.value)}
            helperText={`${displayName.length}/50 ký tự`}
          />
        </div>

        {/* BIO */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Tiểu sử / Giới thiệu cá nhân
            </label>
            <span className="text-[11px] text-slate-400">
              {bio.length}/300 ký tự
            </span>
          </div>
          <textarea
            rows={3}
            value={bio}
            maxLength={300}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Chia sẻ đôi nét về sở thích đọc truyện, thể loại yêu thích hoặc giới thiệu bản thân..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        {/* SOCIAL LINKS */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Liên kết mạng xã hội
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Facebook URL
              </label>
              <Input
                type="url"
                placeholder="https://facebook.com/username"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                X (Twitter) URL
              </label>
              <Input
                type="url"
                placeholder="https://x.com/username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting || isUploadingAvatar}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isUploadingAvatar}
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <EditProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />
    </div>
  );
};
