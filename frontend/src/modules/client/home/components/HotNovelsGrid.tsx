"use client";

import React from "react";
import Link from "next/link";

const HOT_NOVELS = [
  {
    id: "1",
    title: "Tổ Em Lại Cứu Chúa",
    genre: "TIÊN HIỆP",
    genreColor: "text-blue-600",
    author: "Phong Ngọc...",
    chapter: "C.850",
    badge: "HOT",
    badgeColor: "bg-red-600",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLlne1aN4cA9zTaW36RXgOmp5m7QE4XZppZK03L9YMOD8CL7qjIjhS5zu0QUSwNJLHv_mEj9aB6lsWOBLqbtAADueaJcbaAP7hRQJ5Js4SevwfsQmDUFenGZAqa2ITD06aq5jlFwSUrp3UatFrN6MWc26hKeSssA9ZTac0ysQmx1qJ-RkFslObwSH_aEN1XyxpXNaO-lyW5ssgThCRGPCH_SHgXi2YtktxMOBZE3YvMzvjZgZWIrCp4w",
  },
  {
    id: "2",
    title: "Kỷ Nguyên Tinh Vân",
    genre: "KHOA HUYỄN",
    genreColor: "text-indigo-600",
    author: "Bột Nguyệt...",
    chapter: "C.320",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkq7CyOHXwlMDw8hi7n8VaM0AjNHqIUXJ50VDSvjiqQkfyR9avXvHQGufbBTssOARBndJ40pL4yYoFu9c4H24rreVMS6LPIcejIbmdWYFuwMenaDNtHGtm1WeBvSIDWsOz5kZwmOFtzO5xXH37WhU0yAE2hmfENmie5LLivZPqztF_2sCYoR2vyF5Q0AGJ5sIT5Rija6kpdR6XfrRM893YyqOTDb3RlBLxjVw9otY3iEEXpZsRawwd2Q",
  },
  {
    id: "3",
    title: "Gió Thoảng Mùa Thu Đến",
    genre: "NGÔN TÌNH",
    genreColor: "text-pink-600",
    author: "An Điệp",
    chapter: "C.712",
    badge: "FULL",
    badgeColor: "bg-blue-600",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8mnNQvyA-XeYMt0x0mPRgGeUh4faB6ZeaSt4g2SLixnRSKSSqe555Swce9o65VqsjoVgAWPgoCh3JkKiMDIOv-cO31TM6R7AL2PBEoGIql_XV7T4tMNd4nhMhSfWorH9YqssDjhWab-HxrxWLigzX18lAN0W2ubAbE9TiDsVIVzA0rmJ2-jDG8Ew-X3KIBDSX-YKVm8R74Y5KSBfYRNqdchm-VUqoO08KgKkUzp0kCgRGQLMz_Pwudw",
  },
  {
    id: "4",
    title: "Tuyệt Thế Tà Hoàng",
    genre: "HUYỀN HUYỄN",
    genreColor: "text-purple-600",
    author: "Mạc Vô Thần",
    chapter: "C.1140",
    badge: "HOT",
    badgeColor: "bg-red-600",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPv0wzZ_U5DlJ9Q5Qrm9OZwbNdAClGr2nXj0mv1m33n1lhMqQy0KE7e1SnwYclTBkXedLxSenI7BRrBOjU6U4mH0Za5cEUXjcNpbFFz5bpNHuWLb1O5kiBLNtm7S71wclzZRji7hIKn5BUPI_gx5r2htA7EYRjWxVnXgdUNrdaiZwo0hyQx93IfnnbfGNHu2PhdqrnslNkIi_b1OU85mcvIrfqCCYsD1mJzwmxQ8CdL9IEol_V6XTJLA",
  },
  {
    id: "5",
    title: "Đại Việt Sơn Hà Ký",
    genre: "LỊCH SỬ QUÂN SỰ",
    genreColor: "text-emerald-600",
    author: "Trần Quốc...",
    chapter: "C.420",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8BtC1Qad4Hsm1rpr3tj29xTcGc6xcnMxhbUlR2jBW9wpWgP90bUa_ltXTHwLwr6SXMIbcAeTWiNLUqMm7Gr-tFo1fwjyg8KX6LWTGsaXG78Uj3p5csOg8eLxThWjC4hlAHk2TpeDoPv8C3Nv4JY31ysrFRe_pCfh_geHVRKYnTw5xoTIRQCQsd4bpja6yQ07Vm2gD0O4eyoZ6qYBpo6NAdgmT623HLqntnvh8lMQS-Qygxbr75_yQqA",
  },
  {
    id: "6",
    title: "Trọng Sinh Trở Thành Tỷ Phú",
    genre: "ĐÔ THỊ PHÒNG ĐÌNH",
    genreColor: "text-amber-600",
    author: "Lạc Dập Sinh",
    chapter: "C.970",
    badge: "HOT",
    badgeColor: "bg-red-600",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfaMdTAp7Ii9xAR0YLDxE2JfGAkidGTPwS3o5M4T_pKJx2GFhHREP0BwtKzlqj40HKYrX2YdosNsrvdfNlpNMCJQvSHvrfrwgXgJZDBM-9H6XcKqVlg-VWww2NIGyGFl1bZviiYiW1vtunjB6QHAp_7ZjPhgUPl8-qLJmjNkCEH5TpWUboYK2FVsXm3kXJGsVeCrSZ--VOjD2r2PNkLk7JYS6UPsd9ZN4P3960PiI3yjBSnnKY5kKMpg",
  },
  {
    id: "7",
    title: "Toàn Cầu Giáng Lâm",
    genre: "VÕNG DU TẬN THẾ",
    genreColor: "text-cyan-600",
    author: "Mộng Hạo L...",
    chapter: "C.512",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPmxva0BB_-jUG-6I1l4lnPO_Fg9hj4BiM1BG1Lhc8MV09_OXC_Afbn7wMmIRHLqjT8eIba15eQ7FERcESjHNdBgS6is50pzCQgC6n5rKOAy6P4gtVhqCJlFJWl93L-ZwymdBngNPrZKZLOsyg4Dn2oLLgGsj_HrQmp5e64ztQOJPdioSOLBPMKIGpPbWZ4-qIZsdMqz390cc39dRZsZBdu_3e6I6PgXuRQ8n0Us6heQ519gA4uLdMwQ",
  },
  {
    id: "8",
    title: "Trấn Ma Cổ Tháp",
    genre: "LINH DỊ DỊ TẾ",
    genreColor: "text-rose-600",
    author: "Cửu U Khách",
    chapter: "C.645",
    badge: "HOT",
    badgeColor: "bg-red-600",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTVPkixZuEm8jBzy6PgFFF2wk8XEjXntuLGuSGxOpyv8FcM9aeWV9JR_2VT70nrw16tUqpRrWUITU4hgbsMpMqbvQ7xaaMdFeFWJtvNiQd7Fu_uFOc9ke3sVeJfbpbbNpRwfCSl9WVQE2VCSLc6ptsXSB4vZlam1wb55Q_qT7KUYvME8Qcfh23RAnrKPrziHBnrV9c3a5qtsA3NxpTtCEAZgg8HOVzFg0vj_dSrcaDQrLd6S3i0IkHBA",
  },
];

export const HotNovelsGrid: React.FC = () => {
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Truyện Hot Trong Ngày</h2>
        </div>
        <Link
          href="#the-loai"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <span>Xem tất cả</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      </div>

      {/* 4-Column Grid of 8 Books */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {HOT_NOVELS.map((novel) => (
          <article
            key={novel.id}
            className="group bg-white rounded-2xl p-2.5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col cursor-pointer"
          >
            {/* Poster container */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 mb-2.5">
              {novel.badge && (
                <span
                  className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 ${novel.badgeColor} text-white text-[9px] font-black rounded uppercase tracking-wider shadow-xs`}
                >
                  {novel.badge}
                </span>
              )}
              <img
                alt={novel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={novel.cover}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            {/* Genre */}
            <span className={`text-[10px] font-bold uppercase tracking-wider ${novel.genreColor} mb-1`}>
              {novel.genre}
            </span>

            {/* Title */}
            <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-2">
              {novel.title}
            </h3>

            {/* Author & Chapter footer */}
            <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
              <span className="line-clamp-1">{novel.author}</span>
              <span className="font-medium text-slate-500">{novel.chapter}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
