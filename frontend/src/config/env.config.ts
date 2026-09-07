export const envConfig = {
  apiUrl:
    typeof window !== "undefined"
      ? "/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  port: process.env.PORT || 5000,
};