import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, User as UserIcon, GitCompareArrows } from "lucide-react";
import type { NavLink } from "./types";

interface NavLinksProps {
  onLinkClick?: () => void;
  orientation?: "horizontal" | "vertical";
}

export default function NavLinks({ onLinkClick, orientation = "horizontal" }: NavLinksProps) {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/Shop", icon: Store },
    { label: "My Account", href: "/profile", icon: UserIcon },
    { label: "Compare", href: "/Compare", icon: GitCompareArrows },
  ];

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
                  active
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full" />
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
