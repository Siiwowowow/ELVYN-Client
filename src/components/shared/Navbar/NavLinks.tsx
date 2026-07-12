import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, BookOpen, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import type { NavLink } from "./types";

interface NavLinksProps {
  onLinkClick?: () => void;
  orientation?: "horizontal" | "vertical";
  theme?: "light" | "primary";
}

export default function NavLinks({ onLinkClick, orientation = "horizontal", theme = "light" }: NavLinksProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user?.role) return "/login";
    switch (user.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "SELLER":
        return "/seller/dashboard";
      default:
        return "/user/dashboard";
    }
  };

  const navLinks: NavLink[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/Shop", icon: Store },
    { label: "Blog", href: "/Blog", icon: BookOpen },
  ];

  // Only show Dashboard if user is logged in
  if (user) {
    navLinks.push({ label: "Dashboard", href: getDashboardLink(), icon: LayoutDashboard });
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (orientation === "vertical") {
    return (
      <ul className="space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  theme === "primary"
                    ? active
                      ? "text-emerald-800 bg-white"
                      : "text-emerald-100 hover:bg-white/10 hover:text-white"
                    : active
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.label}
                {active && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${theme === "primary" ? "bg-emerald-800" : "bg-emerald-600"}`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-4 lg:gap-8">
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={`font-semibold text-xs lg:text-sm xl:text-base transition-colors hover:text-emerald-600 flex items-center gap-1.5 lg:gap-2 ${
                active ? "text-emerald-600" : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {link.icon && <link.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />}
              <span>{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
