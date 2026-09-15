"use client";

import React, { useRef } from "react";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import { Button } from "@/common/components/Button";
import { Input } from "@/common/components/Input";

interface AvatarUploadSectionProps {
  avatar: string;
  isUploadingAvatar: boolean;
  displayName: string;
  username: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarUrlChange: (url: string) => void;
  onRemoveAvatar: () => void;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const AvatarUploadSection: React.FC<AvatarUploadSectionProps> = ({
  avatar,
  isUploadingAvatar,
  displayName,
  username,
  onFileChange,
  onAvatarUrlChange,
  onRemoveAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Avatar Upload & Preview */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group shrink-0">
          {avatar ? (
            <img
              src={getFullImageUrl(avatar)}
              alt="Avatar Preview"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
              onError={onRemoveAvatar}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
              {getInitials(displayName || username)}
            </div>
          )}

          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white text-xs font-bold">
              Đang tải...
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Ảnh đại diện</span>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Hỗ trợ định dạng JPG, PNG, WEBP tối đa 10MB. Ảnh sẽ được tự động tối ưu hóa.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
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
                onClick={onRemoveAvatar}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-medium transition-colors"
              >
                Xóa ảnh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Avatar URL Input */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Hoặc nhập liên kết ảnh đại diện (URL)
        </label>
        <Input
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={avatar}
          onChange={(e) => onAvatarUrlChange(e.target.value)}
          className="text-xs"
        />
      </div>
    </>
  );
};

interface CoverUploadSectionProps {
  coverImage: string;
  isUploadingCover: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverUrlChange: (url: string) => void;
  onRemoveCover: () => void;
}

export const CoverUploadSection: React.FC<CoverUploadSectionProps> = ({
  coverImage,
  isUploadingCover,
  onFileChange,
  onCoverUrlChange,
  onRemoveCover,
}) => {
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
          <span>🖼️</span>
          <span>Ảnh bìa tác giả (Cover Banner)</span>
        </span>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
          Dành cho Tác giả
        </span>
      </div>

      {/* Preview Banner */}
      <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-800 border border-amber-200">
        {coverImage ? (
          <img
            src={getFullImageUrl(coverImage)}
            alt="Author Cover Preview"
            className="w-full h-full object-cover"
            onError={onRemoveCover}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <span>Chưa có ảnh bìa tùy chỉnh</span>
            <span className="text-[10px] text-slate-500">Hiển thị ảnh nền mặc định</span>
          </div>
        )}

        {isUploadingCover && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
            Đang tải ảnh bìa...
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <input
          type="file"
          ref={coverFileInputRef}
          onChange={onFileChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          id="cover-upload-input"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isUploadingCover}
          onClick={() => coverFileInputRef.current?.click()}
          className="border-amber-300 text-amber-800 hover:bg-amber-100/50"
        >
          📁 Tải ảnh bìa từ máy
        </Button>
        {coverImage && (
          <button
            type="button"
            onClick={onRemoveCover}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-medium transition-colors"
          >
            Xóa ảnh bìa
          </button>
        )}
      </div>

      {/* Direct URL */}
      <div>
        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
          Hoặc dán liên kết ảnh bìa trực tiếp (URL)
        </label>
        <Input
          type="url"
          placeholder="https://example.com/banner.jpg"
          value={coverImage}
          onChange={(e) => onCoverUrlChange(e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
};
