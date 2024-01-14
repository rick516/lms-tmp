import { PrismaClient } from "@prisma/client";

// dev env
declare global {
  var prisma: PrismaClient | undefined;
}

// globalThisはJavaScriptのグローバルオブジェクトを参照するための組み込みオブジェクトです。
// ブラウザ環境ではwindowやself、Node.js環境ではglobalがグローバルオブジェクトとなりますが、
// それらの環境差を吸収してどの環境でも同じようにグローバルオブジェクトを参照できるようにするためのものです。
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;