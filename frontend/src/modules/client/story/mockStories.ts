export interface ChapterInfo {
  chapterNum: number;
  title: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  author: string;
  genres: string[];
  genreBadge?: string;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  coverGradient: string;
  rating: number;
  reviewCount: number | string;
  views: number;
  viewsText?: string;
  chaptersCount: number;
  status: "Đang ra" | "Hoàn thành";
  isHot?: boolean;
  isFeatured?: boolean;
  badge?: "HOT" | "FULL" | "NEW" | "ĐÃ HOÀN";
  latestChapter: ChapterInfo;
  rankDaily?: number;
  rankWeekly?: number;
  rankMonthly?: number;
}

export const GENRES = [
  "Tất cả thể loại",
  "Tiên Hiệp",
  "Huyền Huyễn",
  "Ngôn Tình",
  "Trọng Sinh",
  "Đô Thị",
  "Võng Du",
  "Khoa Huyễn",
  "Đồng Nhân",
] as const;

// Banner Hero Stories (matching Image 2)
export const HERO_FEATURED_STORY: Story = {
  id: "hero-1",
  title: "Vạn Cổ Đệ Nhất Thần Long",
  slug: "van-co-de-nhat-than-long",
  author: "Phong Thanh Dương",
  genres: ["Tiên Hiệp Kỳ Ảo", "Hệ Thống", "Vô Địch Lưu", "Hài Hước", "Đặc Phái Quyền Đoàn"],
  genreBadge: "Tiên Hiệp Kỳ Ảo",
  synopsis:
    "Lý Thiên Mệnh điều khiển mười đại Thái Cổ Hỗn Độn Cự Thú, từ Thần Lăng Hoàng Tộc bước ra, phá vỡ thiên địa gông xiềng. Đấu chư thiên vạn thiên, bình định chư giới vạn vực, ngẩng đoạt thiên mệnh!",
  coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
  bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  coverGradient: "from-sky-900 via-indigo-900 to-blue-950",
  rating: 4.9,
  reviewCount: "18.8k đánh giá",
  views: 3800000,
  viewsText: "3.8M+ Lượt đọc kỳ này",
  chaptersCount: 2154,
  status: "Đang ra",
  isHot: true,
  isFeatured: true,
  badge: "HOT",
  latestChapter: {
    chapterNum: 2154,
    title: "Chương 2154: Thần Long Xuất Thế Vô Địch Thiên Hạ",
    updatedAt: "2 phút trước",
  },
};

export const HERO_CAROUSEL_ITEMS = [
  { id: "hero-1", num: "01", title: "Vạn Cổ Đệ Nhất Thần Long" },
  { id: "hero-2", num: "02", title: "Đỉnh Cao Đệ Nhất Tiên" },
  { id: "hero-3", num: "03", title: "Ta Ở Tiên Giới Nuôi Linh Thú" },
  { id: "hero-4", num: "04", title: "Cổ Diễm: Nàng Âm Chúa Múa" },
];

// 8 Hot Stories in "Truyện Hot Trong Ngày" (matching Image 2)
export const HOT_STORIES_TODAY: Story[] = [
  {
    id: "hot-1",
    title: "Tổ Em Lại Cứu Chúa",
    slug: "to-em-lai-cuu-chua",
    author: "Phong Ngạc...",
    genres: ["TIÊN HIỆP"],
    genreBadge: "TIÊN HIỆP",
    synopsis: "Thiên mệnh luân hồi, cơ duyên bất tận giữa biển người tu đạo huyền ảo.",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-indigo-900 to-slate-900",
    rating: 4.9,
    reviewCount: "8.4k",
    views: 850000,
    chaptersCount: 850,
    status: "Đang ra",
    isHot: true,
    badge: "HOT",
    latestChapter: { chapterNum: 850, title: "C.850", updatedAt: "10 phút trước" },
  },
  {
    id: "hot-2",
    title: "Kỷ Nguyên Tinh Vân",
    slug: "ky-nguyen-tinh-van",
    author: "Bột Nguyệt...",
    genres: ["KHOA HUYỄN"],
    genreBadge: "KHOA HUYỄN",
    synopsis: "Chiến hạm viễn chinh giữa các thiên hà bao la, khám phá văn minh cổ xưa.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-cyan-900 to-blue-950",
    rating: 4.8,
    reviewCount: "5.2k",
    views: 320000,
    chaptersCount: 320,
    status: "Đang ra",
    latestChapter: { chapterNum: 320, title: "C.320", updatedAt: "15 phút trước" },
  },
  {
    id: "hot-3",
    title: "Gió Thoảng Mùa Thu Đến",
    slug: "gio-thoang-mua-thu-den",
    author: "An Điệp",
    genres: ["NGÔN TÌNH"],
    genreBadge: "NGÔN TÌNH",
    synopsis: "Một câu chuyện tình dịu dàng sâu lắng giữa lòng Hà Nội cổ kính.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-amber-900 to-rose-950",
    rating: 4.9,
    reviewCount: "9.1k",
    views: 712000,
    chaptersCount: 712,
    status: "Hoàn thành",
    badge: "FULL",
    latestChapter: { chapterNum: 712, title: "C.712", updatedAt: "Hôm qua" },
  },
  {
    id: "hot-4",
    title: "Tuyệt Thế Tà Hoàng",
    slug: "tuyet-the-ta-hoang",
    author: "Mạc Vô Thần",
    genres: ["HUYỀN HUYỄN"],
    genreBadge: "HUYỀN HUYỄN",
    synopsis: "Ma đạo hoàng giả trùng sinh một thế, quyết đạp bằng thiên lộ tôn giả.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-purple-950 to-zinc-950",
    rating: 4.9,
    reviewCount: "14.2k",
    views: 1140000,
    chaptersCount: 1140,
    status: "Đang ra",
    isHot: true,
    badge: "HOT",
    latestChapter: { chapterNum: 1140, title: "C.1140", updatedAt: "25 phút trước" },
  },
  {
    id: "hot-5",
    title: "Đại Việt Sơn Hà Ký",
    slug: "dai-viet-son-ha-ky",
    author: "Trần Quốc...",
    genres: ["LỊCH SỬ QUÂN SỰ"],
    genreBadge: "LỊCH SỬ QUÂN SỰ",
    synopsis: "Hào khí Đông A, giữ vững non sông bờ cõi trước giặc phương Bắc.",
    coverImage: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-emerald-950 to-stone-900",
    rating: 4.8,
    reviewCount: "6.7k",
    views: 420000,
    chaptersCount: 420,
    status: "Đang ra",
    latestChapter: { chapterNum: 420, title: "C.420", updatedAt: "40 phút trước" },
  },
  {
    id: "hot-6",
    title: "Trọng Sinh Trở Thành Tỷ Phú",
    slug: "trong-sinh-tro-thanh-ty-phu",
    author: "Lạc Dập Sinh",
    genres: ["ĐÔ THỊ PHÒNG ĐÌNH"],
    genreBadge: "ĐÔ THỊ PHÒNG ĐÌNH",
    synopsis: "Nắm bắt thời cơ kinh tế, xây dựng đế chế tài chính toàn cầu từ hai bàn tay trắng.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-blue-900 to-slate-900",
    rating: 4.7,
    reviewCount: "11.5k",
    views: 970000,
    chaptersCount: 970,
    status: "Đang ra",
    isHot: true,
    badge: "HOT",
    latestChapter: { chapterNum: 970, title: "C.970", updatedAt: "50 phút trước" },
  },
  {
    id: "hot-7",
    title: "Toàn Cầu Giáng Lâm",
    slug: "toan-cau-giang-lam",
    author: "Mộng Hạo L...",
    genres: ["VÕNG DU TẬN THẾ"],
    genreBadge: "VÕNG DU TẬN THẾ",
    synopsis: "Thế giới dung hợp trò chơi tử vong, thăng cấp kỹ năng sinh tồn tuyệt đỉnh.",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-sky-950 to-teal-900",
    rating: 4.8,
    reviewCount: "7.9k",
    views: 512000,
    chaptersCount: 512,
    status: "Đang ra",
    latestChapter: { chapterNum: 512, title: "C.512", updatedAt: "1 giờ trước" },
  },
  {
    id: "hot-8",
    title: "Trấn Ma Cổ Tháp",
    slug: "tran-ma-co-thap",
    author: "Cửu U Khách",
    genres: ["LINH DỊ DỊ TẾ"],
    genreBadge: "LINH DỊ DỊ TẾ",
    synopsis: "Cổ tháp ngàn năm phong ấn yêu ma, thiếu niên chấp kiếm trấn thủ nhân gian.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    coverGradient: "from-red-950 to-zinc-950",
    rating: 4.8,
    reviewCount: "8.8k",
    views: 645000,
    chaptersCount: 645,
    status: "Đang ra",
    isHot: true,
    badge: "HOT",
    latestChapter: { chapterNum: 645, title: "C.645", updatedAt: "1 giờ trước" },
  },
];

// Truyện Mới Ra Mắt (matching Image 2)
export const NEW_RELEASES = [
  {
    id: "new-1",
    title: "Luận Kiếm Sơn...",
    genre: "ĐỒNG NHÂN",
    desc: "Mang theo bí truyền Sơn Gia trong sinh...",
    author: "Mai Trung Kiệt",
    chapter: "C.18",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "new-2",
    title: "Thanh Khâu...",
    genre: "HUYỀN HUYỄN",
    desc: "Truyền thuyết với mối tình cửu vĩ hồ...",
    author: "Lạc Vũ Thiên",
    chapter: "C.35",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "new-3",
    title: "Hợp Đồng Ti...",
    genre: "ĐÔ THỊ",
    desc: "Cuộc hôn nhân giả định gian nan giữa...",
    author: "Hạ Hạ",
    chapter: "C.12",
    cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
  },
];

// Mới Lên Chương (Trực Tiếp) (matching Image 2)
export const LIVE_CHAPTERS = [
  {
    genre: "Tiên Hiệp",
    title: "Đại Đạo Tranh Phong",
    chapter: "Chương 1284: Nhất Kiếm định càn khôn",
    author: "Ngô Đạo Giả",
    time: "1 phút trước",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    genre: "Huyền Huyễn",
    title: "Mục Thần Kỷ Cương",
    chapter: "Chương 781: Đại Chu Thiên Bí Pháp",
    author: "Trư Đầu Thần",
    time: "2 phút trước",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    genre: "Đô Thị",
    title: "Thần Y Xuống Núi",
    chapter: "Chương 212: Cứu Người Bằng Cửu Châm",
    author: "Tiêu Diệp",
    time: "6 phút trước",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    genre: "Khoa Huyễn",
    title: "Thôn Phệ Tinh Không II",
    chapter: "Chương 490: Trở Về Trái Cây Binh Bộ",
    author: "Ngã Cật Tây Hồng Thị",
    time: "11 phút trước",
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
  },
  {
    genre: "Trọng Sinh",
    title: "Sau Khi Trùng Sinh Tôi Cộ...",
    chapter: "Chương 84: Lời Hứa Dưới Mây",
    author: "Thanh Thanh Tô",
    time: "22 phút trước",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    genre: "Võng Du",
    title: "Toàn Chức Pháp Sư: Thần...",
    chapter: "Chương 1320: Lôi Hệ Bá Thể",
    author: "Luạn",
    time: "30 phút trước",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
];

// Bảng Xếp Hạng 1-10 (matching Image 2)
export const RANKINGS = [
  {
    rank: 1,
    title: "Vạn Cổ Đệ Nhất Thần Long",
    author: "Phong Thanh Dương",
    reads: "542K lượt đọc",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80",
  },
  {
    rank: 2,
    title: "Kiếm Đạo Đệ Nhất Tiên",
    author: "Tiêu Dao",
    reads: "412K lượt đọc",
    cover: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=300&q=80",
  },
  {
    rank: 3,
    title: "Ta Ở Tiên Giới Nuôi Linh Thú",
    author: "Giản Khoan Chu",
    reads: "321K lượt đọc",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
  },
  { rank: 4, title: "Thôn Phệ Tinh Không II", reads: "436K" },
  { rank: 5, title: "Già Thiên: Mùa Thu Tàn", reads: "398K" },
  { rank: 6, title: "Tuyệt Thế Tà Hoàng", reads: "315K" },
  { rank: 7, title: "Toàn Cầu Giáng Lâm", reads: "235K" },
  { rank: 8, title: "Đại Việt Sơn Hà Ký", reads: "214K" },
  { rank: 9, title: "Trấn Ma Cổ Tháp", reads: "208K" },
  { rank: 10, title: "Trọng Sinh Làm Tỷ Phú", reads: "196K" },
];

// Tác Giả Nổi Bật (matching Image 2)
export const TOP_AUTHORS = [
  {
    name: "Phong Thanh Dương",
    verified: true,
    followers: "142K người theo dõi",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "An Điệp",
    verified: true,
    followers: "98K người theo dõi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Mạc Vô Thần",
    verified: false,
    followers: "75K người theo dõi",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  },
];

// Diễn Đàn Sôi Nổi (matching Image 2)
export const FORUM_HOT_TOPICS = [
  {
    tag: "Thảo luận",
    tagColor: "bg-blue-50 text-blue-600",
    time: "12 phút trước",
    title: "Dự đoán đại kết cục Vạn Cổ Đệ Nhất Thần Long: Liệu Thiên Mệnh có đạt p...",
    author: "Độc Giả 99",
    replies: "342 bình luận",
    slug: "du-doan-dai-ket-cuc-van-co-de-nhat-than-long",
  },
  {
    tag: "Chia sẻ",
    tagColor: "bg-purple-50 text-purple-600",
    time: "45 phút trước",
    title: "Kinh nghiệm xây dựng hệ thống tu luyện cho người mới bắt đầu sáng tác tiểu...",
    author: "Hội Tác Thanh Lam",
    replies: "146 bình luận",
    slug: "lam-sao-de-xay-dung-he-thong-tu-luyen-logic",
  },
  {
    tag: "Review",
    tagColor: "bg-amber-50 text-amber-600",
    time: "2 giờ trước",
    title: "Top 5 bộ truyện Huyền Huyễn có văn phong cuốn hút nhất quý 1 năm nay",
    author: "Bình Bạch Cô",
    replies: "87 bình luận",
    slug: "top-5-bo-truyen-huyen-huyen-cuon-hut",
  },
];

// Featured work in Author Profile (Image 3)
export const PROFILE_AUTHOR_WORKS = {
  featured: {
    title: "Huyền Đạo Chi Thượng",
    badge: "ĐANG RA",
    rankBadge: "Top 1 Tiên Hiệp",
    rating: "4.9 (1.4K đánh giá)",
    latestChapter: "Chương 482: Thần Kiếm Nhập Thể",
    updatedAt: "2 giờ trước",
    synopsis:
      "Thiếu niên Lâm Phong vốn là đệ tử ngoại môn chịu đủ chèn ép tại Cổ Nguyệt Tông, vô tình kích hoạt Luân Hồi Linh Kiếm trong vách đá Vô Nhai. Từ đó một kiếm bổ trời, phá giải vạn pháp, đạp lên tiên lộ nghịch thiên xưng vương...",
    stats: {
      chapters: 482,
      words: "1.15M",
      reads: "942.5K",
    },
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
  },
  subWorks: [
    {
      title: "Kỷ Nguyên Trạng Tội 2099",
      genre: "KHOA HUYỄN",
      chapters: "312 chương",
      status: "ĐÃ HOÀN",
      rating: "4.8 (210K đọc)",
      desc: "Đêm vĩnh hằng buông xuống Tân Đông Kinh, trí tuệ nhân tạo thức tỉnh gieo rắc...",
      cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
    },
    {
      title: "Hậu Cung Phượng Vũ Ký",
      genre: "CUNG ĐẤU / CỔ ĐẠI",
      chapters: "180 chương",
      status: "ĐÃ HOÀN",
      rating: "4.7 (145K đọc)",
      desc: "Bước qua chín cổng cấm thành, nàng từng thề không bao giờ trở thành quân cờ tro...",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
    },
  ],
  readingHistory: [
    {
      title: "Quỷ Bí Chi Chủ",
      progress: "Đã đọc: Chương 89/120",
      percent: 74,
    },
    {
      title: "Vạn Cổ Đệ Nhất Thần",
      progress: "Đã đọc: Chương 345/520",
      percent: 66,
    },
  ],
  achievements: [
    { title: "Bút Vàng Triệu Chữ", desc: "Viết hơn 1.000.000 từ", icon: "💎", color: "bg-amber-50 text-amber-600" },
    { title: "Top 1 Thịnh Hành", desc: "Giữ vững BXH 4 tuần", icon: "🔥", color: "bg-purple-50 text-purple-600" },
    { title: "Vạn Người Mê", desc: "40.000+ Người theo dõi", icon: "👥", color: "bg-blue-50 text-blue-600" },
    { title: "Cập Nhật Thần Tốc", desc: "30 ngày không ngắt quãng", icon: "⚡", color: "bg-orange-50 text-orange-600" },
  ],
  topFans: [
    { rank: 1, name: "Trần Hữu Nam", title: "Minh Chủ Bang Hội", amount: "25.000 LT", badgeColor: "bg-amber-100 text-amber-700" },
    { rank: 2, name: "Lê Ngọc Mai", title: "Đại Trưởng Lão", amount: "18.500 LT", badgeColor: "bg-slate-100 text-slate-700" },
    { rank: 3, name: "Quốc Khánh 98", title: "Hộ Pháp", amount: "12.000 LT", badgeColor: "bg-amber-50 text-amber-800" },
    { rank: 4, name: "Võ Thành Đạt", title: "Chấp Sự", amount: "8.500 LT", badgeColor: "bg-slate-50 text-slate-600" },
    { rank: 5, name: "Hà Vân Anh", title: "Đệ Tử Nội Môn", amount: "5.000 LT", badgeColor: "bg-slate-50 text-slate-600" },
  ],
};

// 3 System Roles Definitions
export type AppRole = "USER" | "AUTHOR" | "ADMIN";

export interface DemoUserAccount {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: AppRole;
  avatar: string;
  isActive: boolean;
  isEmailVerified: boolean;
  penName?: string;
  storiesCount?: number;
  joinedDate: string;
  lastLogin: string;
}

export const DEMO_SYSTEM_USERS: DemoUserAccount[] = [
  {
    id: "usr-001",
    username: "haidang_author",
    displayName: "Nguyễn Hải Đăng",
    email: "haidang.writer@storyvn.vn",
    role: "AUTHOR",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    penName: "Thanh Lam Tiên Sinh",
    storiesCount: 4,
    joinedDate: "14/03/2021",
    lastLogin: "Vừa xong",
  },
  {
    id: "usr-002",
    username: "admin_storyvn",
    displayName: "Quản Trị Viên Trưởng",
    email: "admin@storyvn.vn",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "01/01/2021",
    lastLogin: "10 phút trước",
  },
  {
    id: "usr-003",
    username: "tieuthuyetgia_phong",
    displayName: "Phong Thanh Dương",
    email: "phongthanhduong@storyvn.vn",
    role: "AUTHOR",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    penName: "Phong Thanh Dương",
    storiesCount: 8,
    joinedDate: "12/08/2022",
    lastLogin: "1 giờ trước",
  },
  {
    id: "usr-004",
    username: "docgia_nguyenthuy",
    displayName: "Trần Hữu Nam",
    email: "huunam.tran@gmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "20/05/2023",
    lastLogin: "2 giờ trước",
  },
  {
    id: "usr-005",
    username: "lengocmai_vip",
    displayName: "Lê Ngọc Mai",
    email: "ngocmai.le@outlook.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "04/09/2023",
    lastLogin: "5 giờ trước",
  },
  {
    id: "usr-006",
    username: "andiep_writer",
    displayName: "An Điệp",
    email: "andiep.novel@storyvn.vn",
    role: "AUTHOR",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    penName: "An Điệp",
    storiesCount: 3,
    joinedDate: "15/11/2022",
    lastLogin: "Hôm qua",
  },
  {
    id: "usr-007",
    username: "spammer_blocked",
    displayName: "Tài Khoản Vi Phạm",
    email: "violation_bot@tempmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    isActive: false,
    isEmailVerified: false,
    joinedDate: "01/03/2024",
    lastLogin: "3 ngày trước",
  },
];

// Backwards compatibility
export const MOCK_STORIES = HOT_STORIES_TODAY;
export const FEATURED_BANNER_STORIES = [HERO_FEATURED_STORY];
