"use client";

import React, { useState } from "react";
import { User, UpdateProfileDto } from "@/types/auth";
import { ProfileService } from "../services/profile.service";
import { AuthorService } from "../services/author.service";
import { setStoredUser } from "@/common/utils/token";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";
import { Alert } from "@/common/components/Alert";
import ModalPortal from "@/common/components/ModalPortal";
import { AvatarUploadSection, CoverUploadSection } from "./AvatarUploadSection";

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

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onClose, onSuccess }) => {
  const currentRole = (
    typeof user?.roleId === "object" && user?.roleId?.name
      ? user.roleId.name
      : user?.role || "USER"
  ).toUpperCase();
  const isAuthor = currentRole === "AUTHOR";

  const [displayName, setDisplayName] = useState(user.displayName || user.username || "");
  const [avatar, setAvatar] = useState(user.avatar || user.avatarUrl || "");
  const [coverImage, setCoverImage] = useState(user.authorProfile?.coverImage || "");
  const [bio, setBio] = useState(user.bio || "");
  const [facebook, setFacebook] = useState(user.socialLinks?.facebook || "");
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
        setSuccessMsg("Tải ảnh đại diện lên thành công! Nhấn 'Lưu thay đổi' để hoàn tất.");
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
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Ảnh bìa quá lớn. Vui lòng chọn ảnh dung lượng dưới 10MB.");
      return;
    }
    setIsUploadingCover(true);
    setError(null);
    try {
      const res = await AuthorService.uploadCoverImage(file);
      if (res.success && res.data?.url) {
        setCoverImage(res.data.url);
        setSuccessMsg("Tải ảnh bìa tác giả lên thành công! Nhấn 'Lưu thay đổi' để hoàn tất.");
      } else {
        setError(res.message || "Không thể tải ảnh bìa lên máy chủ.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Lỗi khi tải ảnh bìa lên máy chủ. Vui lòng thử lại.";
      setError(errMsg || "Lỗi khi tải ảnh bìa lên máy chủ.");
    } finally {
      setIsUploadingCover(false);
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
        let updated = res.data.user;

        if (isAuthor) {
          try {
            const authorRes = await AuthorService.updateMyAuthorProfile({
              coverImage: coverImage.trim(),
            });
            if (authorRes.success && authorRes.data?.profile) {
              updated = {
                ...updated,
                authorProfile: {
                  ...(updated.authorProfile || user.authorProfile),
                  ...authorRes.data.profile,
                  coverImage: coverImage.trim(),
                },
              };
            }
          } catch (authorErr) {
            console.warn("Lỗi khi cập nhật ảnh bìa tác giả:", authorErr);
          }
        }

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

  return (
    <div
      className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-800">Chỉnh sửa hồ sơ cá nhân</h3>
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
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

        {/* Avatar Upload */}
        <AvatarUploadSection
          avatar={avatar}
          isUploadingAvatar={isUploadingAvatar}
          displayName={displayName}
          username={user.username}
          onFileChange={handleAvatarFileChange}
          onAvatarUrlChange={setAvatar}
          onRemoveAvatar={() => setAvatar("")}
        />

        {/* Author Cover Banner */}
        {isAuthor && (
          <CoverUploadSection
            coverImage={coverImage}
            isUploadingCover={isUploadingCover}
            onFileChange={handleCoverFileChange}
            onCoverUrlChange={setCoverImage}
            onRemoveCover={() => setCoverImage("")}
          />
        )}

        {/* Display Name */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            {isAuthor ? "Tên hiển thị / Bút danh" : "Tên hiển thị độc giả"} <span className="text-red-500">*</span>
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

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">Tiểu sử / Giới thiệu cá nhân</label>
            <span className="text-[11px] text-slate-400">{bio.length}/300 ký tự</span>
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

        {/* Social Links */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Liên kết mạng xã hội</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Facebook URL</label>
              <Input
                type="url"
                placeholder="https://facebook.com/username"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">X (Twitter) URL</label>
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

        {/* Actions */}
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
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <EditProfileForm
        key={user._id || user.id || user.username}
        user={user}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </ModalPortal>
  );
};
