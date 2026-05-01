import { Sidebar } from "./sidebar";
import type { Role } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  userName: string;
  userEmail: string;
}

export function DashboardLayout({ children, role, userName, userEmail }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
