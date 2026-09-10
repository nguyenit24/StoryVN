import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/dang-nhap", permanent: true },
      { source: "/register", destination: "/dang-ky", permanent: true },
      { source: "/forgot-password", destination: "/quen-mat-khau", permanent: true },
      { source: "/me", destination: "/ho-so", permanent: true },
      { source: "/forum", destination: "/dien-dan", permanent: true },
    ];
  },
};

export default nextConfig;
