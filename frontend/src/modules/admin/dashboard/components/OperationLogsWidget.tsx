"use client";

import React from "react";
import Link from "next/link";
import { OperationLogItem } from "../models/dashboard.model";

interface OperationLogsWidgetProps {
  logs?: OperationLogItem[];
}

export default function OperationLogsWidget({ logs }: OperationLogsWidgetProps) {
  const currentLogs = logs || [
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
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Nhật ký hoạt động</h3>
        <Link href="/admin/settings" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Xem thêm
        </Link>
      </div>
      <div className="mt-3 space-y-3">
        {currentLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <span
              className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${log.initialBgColor}`}
            >
              {log.adminInitial}
            </span>
            <div className="text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{log.adminName}</span>
                <span className="text-[11px] text-slate-400">{log.time}</span>
              </div>
              <p className="text-slate-500 mt-0.5">
                {log.actionPrefix}{" "}
                <span className="text-slate-800 font-medium">{log.subject}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
