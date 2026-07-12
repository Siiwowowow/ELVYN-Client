"use client";

import React from "react";
import { Shield, Home, LogOut, LayoutDashboard, Users, FileText, Settings, ShoppingBag, Tag } from "lucide-react";
import PanelToggleIcon from "@/app/(dashboardLayout)/seller/Paneltoggleicon";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export const ADMIN_ROUTES = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { id: "users", label: "User Management", icon: Users, path: "/admin/users" },
  { id: "products", label: "Product Management", icon: ShoppingBag, path: "/admin/products" },
  { id: "categories", label: "Category Management", icon: Tag, path: "/admin/categories" },
  { id: "logs", label: "System Logs", icon: FileText, path: "/admin/logs" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeRoute: string;
  onNavigate: (id: string) => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
  activeRoute,
  onNavigate,
}: AdminSidebarProps) {
  const { user, logout } = useUser();

  const handleRouteClick = (routeId: string) => {
    onNavigate(routeId);
    // On mobile, auto-close sidebar drawer after navigation
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-45 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`h-screen flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out
          fixed md:sticky top-0 z-50
          ${
            collapsed
              ? "-translate-x-full md:translate-x-0 md:w-[72px]"
              : "translate-x-0 w-64 shadow-2xl md:shadow-none"
          }`}
      >
        {/* Brand row */}
        <div
          className={`flex items-center h-16 border-b border-slate-800 shrink-0 ${
            collapsed ? "justify-center px-2" : "justify-between px-3"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-emerald-600 text-white shrink-0 shadow-md shadow-emerald-500/10">
                <Shield size={18} />
              </div>
              <span className="ml-3 font-semibold text-white text-sm tracking-wide truncate">
                Admin Console
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Open sidebar" : "Close sidebar"}
            className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors shrink-0"
          >
            <PanelToggleIcon collapsed={collapsed} />
          </button>
        </div>

        {/* Route list */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {ADMIN_ROUTES.map((route) => {
            const Icon = route.icon;
            const isActive = activeRoute === route.id;
            return (
              <button
                key={route.id}
                type="button"
                title={collapsed ? route.label : undefined}
                onClick={() => handleRouteClick(route.id)}
                className={`group relative w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${collapsed ? "justify-center" : "justify-start gap-3"}
                  ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-emerald-500" />
                )}
                <Icon size={19} className="shrink-0" />
                {!collapsed && <span className="truncate">{route.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Home & User Profile Info */}
        <div className="mt-auto border-t border-slate-800 bg-slate-950/20 py-2 shrink-0">
          {/* Home Navigation button */}
          <Link
            href="/"
            title={collapsed ? "Home" : undefined}
            className={`mx-2 mb-2 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors
              ${collapsed ? "justify-center" : "justify-start gap-3"}`}
          >
            <Home size={19} className="shrink-0" />
            {!collapsed && <span className="truncate">Store Home</span>}
          </Link>

          {/* User Info & Logout Button */}
          {!collapsed ? (
            <div className="flex items-center justify-between p-3 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center min-w-0 gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm border border-slate-700 overflow-hidden shrink-0 shadow-inner">
                  {user?.image || user?.uploadedImage ? (
                    <img
                      src={user.image || user.uploadedImage || ""}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-semibold text-slate-200 truncate leading-tight">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5">
                    {user?.email || "admin@example.com"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Logout"
                className="p-1.5 text-slate-500 hover:text-rose-450 hover:bg-slate-800 rounded-md transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-2 border-t border-slate-800 bg-slate-950/40 gap-2">
              <div
                title={user?.email || "Admin Panel"}
                className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm border border-slate-700 overflow-hidden shrink-0 shadow-inner"
              >
                {user?.image || user?.uploadedImage ? (
                  <img
                    src={user.image || user.uploadedImage || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
              <button
                onClick={() => logout()}
                title="Logout"
                className="p-1.5 text-slate-500 hover:text-rose-450 hover:bg-slate-800 rounded-md transition-colors shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
