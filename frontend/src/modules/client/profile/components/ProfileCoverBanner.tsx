"use client";

import React from "react";
import { getFullImageUrl } from "@/common/utils/imageUrl";

interface ProfileCoverBannerProps {
  coverImage?: string;
  onEditCover: () => void;
}

export const ProfileCoverBanner: React.FC<ProfileCoverBannerProps> = ({
  coverImage,
  onEditCover,
}) => {
  return (
    <div className="relative w-full h-56 sm:h-72 bg-slate-900 overflow-hidden">
      <img
        src={
          coverImage
            ? getFullImageUrl(coverImage)
            : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80"
        }
        alt="Cover Banner"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

      <button
        type="button"
        onClick={onEditCover}
        className="absolute top-4 right-4 sm:top-6 sm:right-8 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
      >
        <span>📷</span>
        <span>Đổi ảnh bìa</span>
      </button>
    </div>
  );
};
