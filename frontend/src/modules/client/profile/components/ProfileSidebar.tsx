"use client";

import React from "react";

type ReadingTheme = "light" | "sepia" | "green" | "dark";

interface ProfileSidebarProps {
  isAuthor: boolean;
  isReader: boolean;
  readingTheme: ReadingTheme;
  fontSize: number;
  fontFamily: string;
  onThemeChange: (theme: ReadingTheme) => void;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (font: string) => void;
  onWithdraw: () => void;
  onUpgradeAuthor: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  isAuthor,
  isReader,
  readingTheme,
  fontSize,
  fontFamily,
  onThemeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onWithdraw,
  onUpgradeAuthor,
}) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Widget: Nhuận bút (Author only) */}
      {isAuthor && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">💰</span>
              <h4 className="font-black text-sm text-slate-900">Nhuận bút &amp; Linh Thạch</h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">Tháng này</span>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">ƯỚC TÍNH DOANH THU THÁNG NÀY</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                14.850.000 <span className="text-sm font-bold text-slate-500">VNĐ</span>
              </span>
              <span className="text-xs font-bold text-emerald-600">↑ 16.2%</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="h-10 w-full flex items-end justify-between px-1 pt-2">
            {[20, 35, 30, 45, 40, 60, 55, 70, 65, 85, 95].map((h, i) => (
              <div
                key={i}
                className="w-2 bg-blue-500/30 rounded-t-xs hover:bg-blue-600 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Số dư Linh Thạch: <b className="text-slate-900">84.200 LT</b></span>
            <span className="text-[10px] text-slate-400">Đã duyệt</span>
          </div>

          <button
            type="button"
            onClick={onWithdraw}
            className="w-full py-3 bg-[#1d72fe] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💳 Yêu cầu rút nhuận bút</span>
          </button>
        </div>
      )}

      {/* Widget: Túi Đồ (Reader only) */}
      {isReader && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">💎</span>
              <h4 className="font-black text-sm text-slate-900">Túi Đồ &amp; Tài Sản</h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Ví Độc Giả</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Linh Thạch</div>
              <div className="text-lg font-black text-blue-600">1.200 LT</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Phiếu Đề Cử</div>
              <div className="text-lg font-black text-amber-600">15 Vé</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onUpgradeAuthor}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✍️ Nâng cấp trở thành Tác giả</span>
          </button>
        </div>
      )}

      {/* Widget: Reading Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <h4 className="font-black text-sm text-slate-900">Tùy chỉnh đọc truyện nhanh</h4>
          </div>
          <span className="text-[10px] text-slate-400">Đồng bộ</span>
        </div>

        {/* Theme selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600">Giao diện đọc</label>
          <div className="grid grid-cols-4 gap-1.5 text-xs text-center font-bold">
            {(
              [
                { key: "light" as ReadingTheme, label: "Sáng", cls: "bg-white border-slate-200 text-slate-700", activeExtra: "border-blue-600 text-blue-600 shadow-xs" },
                { key: "sepia" as ReadingTheme, label: "Giấy cũ", cls: "bg-[#fbf0d9] border-amber-200 text-amber-800", activeExtra: "border-amber-600 text-amber-900 font-black shadow-xs" },
                { key: "green" as ReadingTheme, label: "Dịu mắt", cls: "bg-[#e8f5e9] border-emerald-200 text-emerald-800", activeExtra: "border-emerald-600 text-emerald-900 font-black shadow-xs" },
                { key: "dark" as ReadingTheme, label: "Đêm đen", cls: "bg-slate-900 border-slate-800 text-slate-200", activeExtra: "bg-slate-950 border-blue-500 text-white font-black shadow-xs" },
              ] as const
            ).map(({ key, label, cls, activeExtra }) => (
              <button
                key={key}
                type="button"
                onClick={() => onThemeChange(key)}
                className={`py-2 rounded-xl border transition-all cursor-pointer ${cls} ${readingTheme === key ? activeExtra : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
            <span>Cỡ chữ mặc định</span>
            <span className="text-blue-600">{fontSize}px (Chuẩn)</span>
          </div>
          <input
            type="range"
            min={14}
            max={26}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>14px</span>
            <span>18px (Chuẩn)</span>
            <span>26px</span>
          </div>
        </div>

        {/* Font family */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600">Phông chữ hiển thị</label>
          <select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-500"
          >
            <option>Be Vietnam Pro (Hiện đại)</option>
            <option>Merriweather (Cổ điển có chân)</option>
            <option>Roboto (Rõ ràng dễ đọc)</option>
            <option>Nunito (Mềm mại)</option>
          </select>
        </div>
      </div>

      {/* Support widget */}
      <div className="rounded-3xl bg-blue-600 p-5 text-white flex items-center gap-4 shadow-lg shadow-blue-500/20">
        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">🎧</div>
        <div className="space-y-0.5">
          <h5 className="font-black text-xs sm:text-sm">Trung tâm trợ giúp StoryVN</h5>
          <p className="text-[11px] text-blue-100">Hỗ trợ giải đáp thắc mắc tác quyền &amp; độc giả 24/7.</p>
        </div>
      </div>
    </div>
  );
};
