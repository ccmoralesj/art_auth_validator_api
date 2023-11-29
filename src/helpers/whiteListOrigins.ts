import { WHITE_LIST_ORIGINS } from "./consts/index.js";

export function fillWhiteListOrigins() {
  const allowedOrigins: string[] = [
    "http://localhost:3000",
    process.env.FRONTEND_URI,
    `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
  ];
  WHITE_LIST_ORIGINS.push(...allowedOrigins);
}
