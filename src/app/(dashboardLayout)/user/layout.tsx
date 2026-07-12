"use client";

import UserSidebar, { USER_ROUTES } from "@/components/layout/UserSidebar";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defaults to collapsed/hidden on mobile, collapsed to 72px on desktop
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Match the active sidebar tab with the current pathname
  const activeRoute = USER_ROUTES.find((r) => pathname.startsWith(r.path))?.id || "dashboard";

  const handleNavigate = (id: string) => {
    const target = USER_ROUTES.find((r) => r.id === id);
    if (target) {
      router.push(target.path);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen w-full relative">
      {/* Sidebar - responsive layout */}
      <UserSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
      />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Floating Mobile Sidebar Trigger */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="md:hidden fixed top-4 left-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-slate-200 shadow-lg border border-slate-800 cursor-pointer hover:bg-slate-800 active:scale-95 transition-all"
            title="Open Sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Dashboard content */}
        <div className="p-4 md:p-6 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
