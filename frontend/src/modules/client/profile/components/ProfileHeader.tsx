"use client";

import React from "react";
import Link from "next/link";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import { User } from "@/modules/client/auth/models/auth.model";
import { AppRole } from "@/modules/client/story/mockStories";

interface ProfileHeaderProps {
  user: User;
  displayName: string;
  displayBio: string;
  displayId: string;
  joinedDateStr: string;
  currentRole: AppRole;
  isAuthor: boolean;
  isAdmin: boolean;
  isReader: boolean;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onUpgradeAuthor: () => void;
  onAuthorAction: (msg: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  displayName,
  displayBio,
  displayId,
  joinedDateStr,
  currentRole,
  isAuthor,
  isAdmin,
  isReader,
  onEditProfile,
  onChangePassword,
  onUpgradeAuthor,
  onAuthorAction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Avatar & User Info */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            {user?.avatar ? (
              <img
                src={getFullImageUrl(user.avatar)}
                alt={displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-slate-100"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white shadow-xl">
                {(displayName[0] || "U").toUpperCase()}
              </div>
            )}

            {/* Role Badge */}
            <span
              className={`absolute -top-2 -left-2 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-sm ${
                isAdmin ? "bg-purple-600" : isAuthor ? "bg-amber-600" : "bg-blue-600"
              }`}
            >
              {isAdmin ? "ADMIN" : isAuthor ? "TÁC GIẢ" : "ĐỘC GIẢ"}
            </span>

            {/* Edit avatar button */}
            <button
              type="button"
              onClick={onEditProfile}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs shadow-md border-2 border-white cursor-pointer"
              title="Thay đổi ảnh đại diện"
            >
              📷
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{displayName}</h1>

              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                  🛡️ Quản trị viên
                </span>
              )}
              {isAuthor && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                  ✍️ Tác giả StoryVN
                </span>
              )}
              {isReader && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                  📖 Độc giả thân thiết
                </span>
              )}

              <span className="text-xs font-mono font-bold text-slate-400">ID: #{displayId}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">{displayBio}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
              <span>📅 Tham gia {joinedDateStr}</span>
              <span>•</span>
              <span>✉️ {user?.email || "Chưa có email"}</span>
              <span>•</span>
              <span className="text-blue-600 font-bold">@{user?.username || "user"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAuthor && (
            <>
              <button
                type="button"
                onClick={() => onAuthorAction("Mở trình soạn thảo chương mới...")}
                className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>✏️ Soạn thảo chương mới</span>
              </button>
              <button
                type="button"
                onClick={() => onAuthorAction("Đang đồng bộ dữ liệu Studio Tác giả...")}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>📊 Studio tác giả</span>
              </button>
            </>
          )}

          {isReader && (
            <button
              type="button"
              onClick={onUpgradeAuthor}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>✍️ Nâng cấp lên Tác giả</span>
            </button>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>🛡️ Quản trị hệ thống</span>
            </Link>
          )}

          <button
            type="button"
            onClick={onEditProfile}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>✏️ Sửa hồ sơ</span>
          </button>

          <button
            type="button"
            onClick={onChangePassword}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🔑 Đổi mật khẩu</span>
          </button>
        </div>
      </div>

      {/* Stats Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
        {isAuthor ? (
          <>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TÁC PHẨM XUẤT BẢN</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">4</span>
                <span className="text-[11px] text-blue-600 font-semibold">2 đã hoàn</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG LƯỢT ĐỌC</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">1.2M</span>
                <span className="text-[11px] text-emerald-600 font-semibold">+14% tháng này</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NGƯỜI THEO DÕI</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">45.8K</span>
                <span className="text-[11px] text-blue-600 font-semibold">+412 mới</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PHIẾU ĐỀ CỬ</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">128.4K</span>
                <span className="text-[11px] text-amber-600 font-semibold">#Top 32 BXH</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỦ TRUYỆN THEO DÕI</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">32</span>
                <span className="text-[11px] text-blue-600 font-semibold">tác phẩm</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CHƯƠNG ĐÃ ĐỌC</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">1.450</span>
                <span className="text-[11px] text-emerald-600 font-semibold">+82 tuần này</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SỐ DƯ LINH THẠCH</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">1.200</span>
                <span className="text-[11px] text-amber-600 font-semibold">LT</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">VAI TRÒ TÀI KHOẢN</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{currentRole}</span>
                <span className="text-[11px] text-blue-600 font-semibold">Hoạt động</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
