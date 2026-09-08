"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Dữ liệu còn "mới" trong 5 phút
            refetchOnWindowFocus: false, // Không tự động tải lại khi chuyển tab
            retry: 1, // Thử lại tối đa 1 lần nếu gặp lỗi mạng
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
