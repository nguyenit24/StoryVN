declare global {
    interface Window {
        __ENV__?: Record<string, string>;
    }
}

export const envConfig = {


    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "",

    port: Number(process.env.PORT) || 5000,
  apiUrl:
    typeof window !== "undefined"
      ? "/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  port: process.env.PORT || 5000,
};
