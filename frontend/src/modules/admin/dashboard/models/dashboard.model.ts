export type DashboardTimeFilter = "today" | "7days" | "month" | "year";

export interface KpiCardData {
  title: string;
  value: string;
  unit?: string;
  changeText: string;
  changeType: "positive" | "negative" | "neutral" | "urgent";
  subText: string;
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
}

export interface DashboardKpis {
  revenue: KpiCardData;
  activeWorks: KpiCardData;
  totalUsers: KpiCardData;
  urgentTasks: {
    title: string;
    total: number;
    unit: string;
    chaptersPending: number;
    forumPending: number;
    withdrawPending: number;
  };
}

export interface ChartCurvePoint {
  dayLabel: string;
  revenueK: number;
  readsK: number;
}

export interface DashboardTransaction {
  id: string;
  code: string;
  accountName: string;
  accountEmail: string;
  isVerifiedAuthor?: boolean;
  type: "VIETQR" | "ROYALTY_WITHDRAW" | "VISA";
  typeLabel: string;
  typeIcon: string;
  amount: string;
  amountType: "positive" | "neutral";
  status: "SUCCESS" | "PENDING";
  statusLabel: string;
}

export interface DemographicItem {
  label: string;
  countText: string;
  percentage: number;
  colorClass: string;
  bulletClass: string;
}

export interface SystemHealthData {
  blockedBots24h: number;
  cpuUsage: number;
  redisUsage: number;
  isDrmActive: boolean;
}

export interface OperationLogItem {
  id: string;
  adminName: string;
  adminInitial: string;
  initialBgColor: string;
  time: string;
  actionPrefix: string;
  subject: string;
  actionSuffix?: string;
}

export interface DashboardData {
  timeFilter: DashboardTimeFilter;
  kpis: DashboardKpis;
  chartPoints: ChartCurvePoint[];
  peakTooltip: string;
  recentTransactions: DashboardTransaction[];
  demographics: {
    totalFormatted: string;
    items: DemographicItem[];
  };
  systemHealth: SystemHealthData;
  operationLogs: OperationLogItem[];
}
