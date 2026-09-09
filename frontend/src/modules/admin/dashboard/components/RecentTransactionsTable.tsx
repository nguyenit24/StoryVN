"use client";

import React from "react";
import Link from "next/link";
import { DashboardTransaction } from "../models/dashboard.model";

interface RecentTransactionsTableProps {
  transactions?: DashboardTransaction[];
}

export default function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const items = transactions || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Giao dịch nạp xu &amp; Nhuận bút gần đây
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thống kê giao dịch phát sinh qua cổng thanh toán
          </p>
        </div>
        <Link
          href="/admin/finance"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-5">Mã GD</th>
              <th className="py-3 px-4">Tài khoản / Bút danh</th>
              <th className="py-3 px-4">Loại giao dịch</th>
              <th className="py-3 px-4">Số tiền</th>
              <th className="py-3 px-5 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-mono text-xs font-medium text-slate-900 whitespace-nowrap">
                  {txn.code}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-medium text-slate-900 flex items-center gap-1">
                    <span>{txn.accountName}</span>
                    {txn.isVerifiedAuthor && (
                      <span
                        className="material-symbols-outlined text-[14px] text-blue-600"
                        title="Tác giả xác minh"
                      >
                        verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{txn.accountEmail}</div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        txn.type === "ROYALTY_WITHDRAW" ? "text-amber-600" : "text-blue-600"
                      }`}
                    >
                      {txn.typeIcon}
                    </span>
                    <span>{txn.typeLabel}</span>
                  </span>
                </td>
                <td
                  className={`py-3.5 px-4 font-mono font-semibold whitespace-nowrap ${
                    txn.amountType === "positive" ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  {txn.amount}
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  {txn.status === "SUCCESS" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{txn.statusLabel}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{txn.statusLabel}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
