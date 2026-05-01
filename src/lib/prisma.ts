import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function resolveDbUrl(url: string): string {
  // Convert relative file: URLs to absolute for libsql
  if (url.startsWith("file:./") || url.startsWith("file:../")) {
    const relativePath = url.replace("file:", "");
    return "file:" + path.resolve(process.cwd(), relativePath);
  }
  if (url.startsWith("file:") && !url.startsWith("file:/")) {
    const relativePath = url.replace("file:", "");
    return "file:" + path.resolve(process.cwd(), relativePath);
  }
  return url;
}

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
  const url = resolveDbUrl(rawUrl);
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
