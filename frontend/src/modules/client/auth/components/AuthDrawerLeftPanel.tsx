"use client";

import React from "react";
import { AuthMode } from "./AuthDrawer";

interface AuthDrawerLeftPanelProps {
  mode: AuthMode;
}

export const AuthDrawerLeftPanel: React.FC<AuthDrawerLeftPanelProps> = ({ mode }) => {
  return (
    <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-slate-950 overflow-hidden flex-col justify-between p-8 lg:p-10 text-white shrink-0">
      {/* Background Image with Soft Vignette */}
      <img
        alt="StoryVN Không Gian Văn Học Số"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
        src={
          mode === "register"
            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC448_PDwq37D1runHB47hnmR02N8d6Xm0gN5pj-fE-ODFFXwbMQwAdH1SqTLiX23nPF2O9BGTZ2T1C50RZ4RObro4DfrwMGArd0M4OPoI1VnnklZmomNcx64HK6eJLRFwfikKgy6oI_EjBe-kNHMEOhUYnFtzUq3rZFpxJ7D8Qv_KpvJWfk-VfpA8mQuZHdD1L1_xCbWaWbU9EHMvIfX5RsfsZQsX-DRHZHYcrHecaw4GJW32MptOqUA"
            : "https://lh3.googleusercontent.com/aida-public/AB6AXuDCTqBteeVbXG7NQKSeJeFGG0v_cy7L9DMzuD02zpWf09Gy7Z8W2CLcwU8oykB4tAZMHEqufNvOIALTYBX6QaikjuQZH3MxZFsRMEB-YfE1HbFX1kARbIWn2Cc8mwSXFtUE7M08mpLMLseHyzN9RLZirWCogCEI-JHXiqL4LdIC2w32CNo8FlJX_bX2gFmvSr6HGYHRJ7J1tKjuIb_Rre5FQNq16mgKwtOM_CaRylxVfwSMCCO90Shjng"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/40" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="StoryVN Logo"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <div>
            <span className="text-xl font-bold tracking-tight text-white">StoryVN</span>
            <p className="text-xs text-slate-300 font-normal">Nền tảng văn học số độc quyền</p>
          </div>
        </div>
      </div>

      {/* Middle Quote */}
      <div className="relative z-10 my-auto py-6 space-y-3 max-w-sm">
        <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>Hội đồng tuyển chọn StoryVN</span>
        </div>
        <p className="text-slate-100 text-base leading-relaxed italic font-light">
          &ldquo;Nơi mỗi trang viết mở ra một hành trình cảm xúc, và từng câu chữ đều mang hơi thở của văn học Việt đương đại.&rdquo;
        </p>
      </div>

      {/* Bottom Literary Stats */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400 text-[18px]">menu_book</span>
          <span className="text-xs">50.000+ tác phẩm</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span className="text-xs">120.000+ độc giả</span>
        </div>
      </div>
    </div>
  );
};
