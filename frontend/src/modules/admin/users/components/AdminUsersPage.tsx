"use client";

import React from "react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import UserStatsCards from "./UserStatsCards";
import UserFilterBar from "./UserFilterBar";
import UsersTable from "./UsersTable";

export default function AdminUsersPage() {
  const {
    filteredUsers,
    paginatedUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isMaskedPrivacy,
    setIsMaskedPrivacy,
    selectedUserIds,
    handleSelectUser,
    handleSelectAll,
    totalCount,
    readersCount,
    authorsCount,
    lockedCount,
    handleRoleChange,
    handleToggleStatus,
    handleExportExcel,
  } = useAdminUsers(5);

  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeIn">
      {/* 1. PAGE TITLE & MAIN ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Hệ thống quản trị
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-slate-500">
              Phân hệ Tài khoản người dùng
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Người dùng &amp; Tác giả
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {/* Danh sách tài khoản độc giả, tác giả sáng tác, phân quyền và kiểm duyệt */}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {/* Button Xuất Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[17px] text-slate-500">download</span>
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR KPI CARDS (Real Stats) */}
      <UserStatsCards
        totalCount={totalCount}
        readersCount={readersCount}
        authorsCount={authorsCount}
        lockedCount={lockedCount}
      />

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <UserFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isMaskedPrivacy={isMaskedPrivacy}
        onTogglePrivacy={setIsMaskedPrivacy}
        totalCount={totalCount}
      />

      {/* 4. DATA TABLE & PAGINATION FOOTER */}
      <UsersTable
        users={paginatedUsers}
        totalFilteredCount={filteredUsers.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        isMaskedPrivacy={isMaskedPrivacy}
        selectedUserIds={selectedUserIds}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onPageChange={setCurrentPage}
        onRoleChange={handleRoleChange}
        onToggleStatus={handleToggleStatus}
      />
    </main>
  );
}
