import { DashboardData, DashboardTimeFilter } from "../models/dashboard.model";

export const getMockDashboardData = (filter: DashboardTimeFilter): DashboardData => {
  const revenueVal =
    filter === "today"
      ? "428.500.000"
      : filter === "7days"
      ? "2.950.000.000"
      : filter === "month"
      ? "12.840.000.000"
      : "148.500.000.000";

  return {
    timeFilter: filter,
    kpis: {
      revenue: {
        title: "Doanh thu Nạp Xu",
        value: revenueVal,
        unit: "Xu",
        changeText: "+14.2%",
        changeType: "positive",
        subText: "so với tháng trước",
        icon: "account_balance_wallet",
        iconBgColor: "bg-blue-50",
        iconTextColor: "text-blue-600",
      },
      activeWorks: {
        title: "Tác phẩm đang xuất bản",
        value: "18.420",
        unit: "bộ truyện",
        changeText: "+125 truyện mới",
        changeType: "positive",
        subText: "tuần này",
        icon: "menu_book",
        iconBgColor: "bg-indigo-50",
        iconTextColor: "text-indigo-600",
      },
      totalUsers: {
        title: "Tổng người dùng",
        value: "382.900",
        unit: "tài khoản",
        changeText: "46.200",
        changeType: "neutral",
        subText: "độc giả active hôm nay",
        icon: "group",
        iconBgColor: "bg-emerald-50",
        iconTextColor: "text-emerald-600",
      },
      urgentTasks: {
        title: "Yêu cầu cần xử lý",
        total: 28,
        unit: "mục tồn đọng",
        chaptersPending: 14,
        forumPending: 8,
        withdrawPending: 6,
      },
    },
    chartPoints: [
      { dayLabel: "Thứ 6 (18/10)", revenueK: 30, readsK: 120 },
      { dayLabel: "Thứ 7 (19/10)", revenueK: 45, readsK: 160 },
      { dayLabel: "Chủ nhật (20/10)", revenueK: 40, readsK: 185 },
      { dayLabel: "Thứ 2 (21/10)", revenueK: 52, readsK: 210 },
      { dayLabel: "Thứ 3 (22/10)", revenueK: 58, readsK: 245 },
      { dayLabel: "Thứ 4 (23/10)", revenueK: 61, readsK: 280 },
      { dayLabel: "Hôm nay (24/10)", revenueK: 68.4, readsK: 312 },
    ],
    peakTooltip: "Hôm nay: 68.400k Xu / 312k reads",
    recentTransactions: [
      {
        id: "txn-1",
        code: "#TXN-884920",
        accountName: "hoangnam_reader",
        accountEmail: "nam.h***@gmail.com",
        type: "VIETQR",
        typeLabel: "Nạp Xu VietQR",
        typeIcon: "qr_code_2",
        amount: "+500.000 Xu",
        amountType: "positive",
        status: "SUCCESS",
        statusLabel: "Thành công",
      },
      {
        id: "txn-2",
        code: "#ROY-293814",
        accountName: "Mộng Dẫn Thư Sinh",
        accountEmail: "MB Bank •••• 9102",
        isVerifiedAuthor: true,
        type: "ROYALTY_WITHDRAW",
        typeLabel: "Rút nhuận bút",
        typeIcon: "currency_exchange",
        amount: "15.800.000 VNĐ",
        amountType: "neutral",
        status: "PENDING",
        statusLabel: "Đang duyệt",
      },
      {
        id: "txn-3",
        code: "#TXN-884918",
        accountName: "tieu_dao_tu",
        accountEmail: "tieudao***@outlook.com",
        type: "VISA",
        typeLabel: "Thẻ Visa",
        typeIcon: "credit_card",
        amount: "+1.200.000 Xu",
        amountType: "positive",
        status: "SUCCESS",
        statusLabel: "Thành công",
      },
    ],
    demographics: {
      totalFormatted: "Tổng 382.9k",
      items: [
        {
          label: "Độc giả thường",
          countText: "334.850 (87.4%)",
          percentage: 87.4,
          colorClass: "bg-blue-600",
          bulletClass: "bg-blue-600",
        },
        {
          label: "Độc giả VIP / Hội viên",
          countText: "46.200 (12.1%)",
          percentage: 12.1,
          colorClass: "bg-amber-500",
          bulletClass: "bg-amber-500",
        },
        {
          label: "Tác giả đã xác minh",
          countText: "1.850 (0.5%)",
          percentage: 0.5,
          colorClass: "bg-emerald-500",
          bulletClass: "bg-emerald-500",
        },
      ],
    },
    systemHealth: {
      blockedBots24h: 1420,
      cpuUsage: 24.2,
      redisUsage: 42.8,
      isDrmActive: true,
    },
    operationLogs: [
      {
        id: "log-1",
        adminName: "Admin_Duy",
        adminInitial: "D",
        initialBgColor: "bg-blue-100 text-blue-700",
        time: "10:32",
        actionPrefix: "Đã duyệt truyện",
        subject: '"Vạn Cổ Đệ Nhất Thần Long"',
      },
      {
        id: "log-2",
        adminName: "Admin_Ha",
        adminInitial: "H",
        initialBgColor: "bg-emerald-100 text-emerald-700",
        time: "09:18",
        actionPrefix: "Phê duyệt lệnh rút nhuận bút",
        subject: "15.000.000 VNĐ",
      },
      {
        id: "log-3",
        adminName: "Admin_Superuser",
        adminInitial: "S",
        initialBgColor: "bg-slate-100 text-slate-700",
        time: "08:05",
        actionPrefix: "Cập nhật cấu hình tỷ lệ nạp:",
        subject: "100 VNĐ = 1 Xu",
      },
    ],
  };
};
