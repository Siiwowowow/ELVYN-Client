// components/shared/Navbar/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { 
  Menu, 
  X, 
  Search, 

  User,
  LogOut
} from "lucide-react";
import Logo from "@/components/shared/Logo/logo";
import UserAvatar from "./UserAvatar";
import AuthButtons from "./AuthButtons";
import SearchBar from "./SearchBar";
import WishlistIcon from "./WishlistIcon";
import CartIcon from "./CartIcon";
import NavLinks from "./NavLinks";
import type { NavbarProps } from "./types";
import { toast } from "sonner";

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return "U";
};

export default function Navbar({ showTopBar = true }: NavbarProps) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    toast.loading("Logging out...", { id: "logout" });
    await logout();
    toast.success("Logged out successfully!", { id: "logout" });
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Hide navbar on auth and dashboard routes
  const isAuthRoute =
    pathname
      ? pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password"
      : false;

  const isDashboardRoute =
    pathname
      ? pathname.startsWith("/admin") ||
        pathname.startsWith("/seller") ||
        pathname.startsWith("/user")
      : false;

  if (isAuthRoute || isDashboardRoute) {
    return null;
  }

  return (
    <>
      <header
        className={`header sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white border-b border-gray-100"
        }`}
      >
        {/*=============== HEADER TOP ===============*/}
        {showTopBar && (
          <div className="header__top">
            <div className="header__container container">
              <div className="header__contact">
                <span>(+01) - 2345 - 6789</span>
                <span>Our location</span>
              </div>
              <p className="header__alert-news">
                Super Values Deals - Save more coupons
              </p>
            </div>
          </div>
        )}

        {/*=============== MAIN NAV ===============*/}
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-between ml-4 lg:ml-10">
            <NavLinks orientation="horizontal" />

            {/* Search Bar */}
            <SearchBar className="w-[150px] sm:w-[180px] lg:w-[340px] ml-4 lg:ml-8" />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(true)}
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <WishlistIcon className="hidden sm:flex" />

            {/* Cart */}
            <CartIcon className="hidden sm:flex" />

            {/* User Avatar or Auth Buttons */}
            {user ? (
              <UserAvatar />
            ) : (
              <div className="hidden md:flex items-center gap-2 lg:gap-4">
                <AuthButtons orientation="horizontal" />
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#0f766e] text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-end p-4 border-b border-emerald-700/50">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:bg-emerald-700/50 rounded-full text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search in Mobile */}
          <div className="p-4 border-b border-emerald-700/50">
            <SearchBar onSearchSubmit={() => setMenuOpen(false)} theme="primary" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <NavLinks orientation="vertical" onLinkClick={() => setMenuOpen(false)} theme="primary" />
          </nav>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-emerald-700/50">
            {/* Auth Buttons - Mobile */}
            {!user && (
              <AuthButtons orientation="vertical" onLinkClick={() => setMenuOpen(false)} theme="primary" />
            )}

            {/* User Info - Mobile */}
            {user && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {getInitials(user.name, user.email)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                    <p className="text-xs text-emerald-200 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-emerald-100 border border-emerald-500 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-red-200 border border-red-500/30 bg-red-950/20 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}