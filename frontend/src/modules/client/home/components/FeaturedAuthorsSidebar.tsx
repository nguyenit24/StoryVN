"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const INITIAL_AUTHORS = [
  {
    id: "author-1",
    name: "Phong Thanh Dương",
    verified: true,
    followers: "142K người theo dõi",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkPmLNypwz7mCzSq3f7bvNA9Phi8Hp17zgMeP_A2uKVF-BtNBUTx6Qr_4pUMRDwhSWgTBpCdtmwQdhl04Cog2u-_75D8qTlOwyXvdRdUx25cpZ8GiAkLZVJaccdeeh3miVOEGPz64kBciVeuxk9dKphYltj6MjO6iGWJV04Y4IlLL6yC-2ZDFrL08vqzTdhr2PovlkT1uFcmPZZh8kNNF6sE_Or_nWMWk8yFJajM19LD7F5uMkutYY9A",
  },
  {
    id: "author-2",
    name: "An Điệp",
    verified: true,
    followers: "98K người theo dõi",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFzDp3o9x849w-Ucsfq4bUua4bFL-DeJFZN40aybE-qwsi2b8spNZ_K2Su20SODx9BOQ1kg-OiJ8lSh1VvBceQFSy4LDss-H-BCS96na5M72CtWJRJeOe29og6l15brnGbb0XoLuzzZlIKFiBu6Gl4tzOg0Scfz4IrljshWbqMhQFAPSUuKiN7ESPL5BRKhKkLGCnd9XqMVN2QdFiKsa6kciBVyIbXdq7900RlPWVw4JslzhnEDFEG-g",
  },
  {
    id: "author-3",
    name: "Mạc Vô Thần",
    verified: false,
    followers: "75K người theo dõi",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEfGZgk_8AJ4H_UCV3trRl_g9wFVeE2BfvSTlVmiNSijsNRqLLnD1JmeAANndfGb2l9FaJEXSasOiq1VPOeBQBQ-qCKzsCrZG-R8wDRmko3IuhzfJWqYu5t0PkYZl9zxX66bqrYM7Kywd-DzWnisZl7KEx6UnxLCvOZLeDit6zUI-ELvW2xWp5VFR3MRQdDXINb4m7h0uhxWOFenNTNyNzrWirSN2OqiYE6jcc_g7HnNd4GjEpFxusKA",
  },
];

export const FeaturedAuthorsSidebar: React.FC = () => {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string, name: string) => {
    const isNowFollowing = !followingMap[id];
    setFollowingMap((prev) => ({ ...prev, [id]: isNowFollowing }));
    toast.success(isNowFollowing ? `Đã theo dõi tác giả ${name}` : `Đã hủy theo dõi ${name}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">edit</span>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">Tác Giả Nổi Bật</h3>
        </div>
        <Link href="#the-loai" className="text-xs text-blue-600 font-semibold hover:underline">
          Khám phá
        </Link>
      </div>

      {/* Authors list */}
      <div className="space-y-3.5">
        {INITIAL_AUTHORS.map((author) => {
          const isFollowing = !!followingMap[author.id];
          return (
            <div key={author.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  alt={author.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  src={author.avatar}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">{author.name}</span>
                    {author.verified && (
                      <span className="material-symbols-outlined text-blue-500 text-[14px]">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{author.followers}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFollow(author.id, author.name)}
                className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                  isFollowing
                    ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
