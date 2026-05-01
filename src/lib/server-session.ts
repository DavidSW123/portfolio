import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import { redirect } from "next/navigation";
import type { UserSession, Role } from "@/types";

export async function getServerSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(allowedRoles?: Role[]): Promise<UserSession> {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (allowedRoles && !allowedRoles.includes(session.role)) redirect("/unauthorized");
  return session;
}
