// components/shared/Navbar/UserAvatar.tsx
"use client";

import { useUser } from "@/hooks/useUser";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Trash2, 
  LogOut, 
  User, 
  Settings, 
  Shield,
  ShoppingBag,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { removeProfilePhotoService, updateMyProfileService } from "@/services/user.services";

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return "U";
};

export default function UserAvatar() {
  const { user, setUser, logout } = useUser();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = getInitials(user?.name, user?.email);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setOpen(false);
    const toastId = toast.loading("Uploading photo...");

    const formData = new FormData();
    formData.append("profilePhoto", file);

    const result = await updateMyProfileService(formData);

    if (result.success) {
      toast.success("Profile photo updated!", { id: toastId });
      setUser({ ...user!, image: result.data?.image });
      router.refresh();
    } else {
      toast.error(result.message || "Upload failed", { id: toastId });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    setOpen(false);
    const toastId = toast.loading("Removing photo...");
    const result = await removeProfilePhotoService();

    if (result.success) {
      toast.success("Photo removed!", { id: toastId });
      setUser({ ...user!, image: undefined });
      router.refresh();
    } else {
      toast.error(result.message || "Failed to remove photo", { id: toastId });
    }
  };

  // Logout
  const handleLogout = async () => {
    setOpen(false);
    toast.loading("Logging out...", { id: "logout" });
    await logout();
    toast.success("Logged out successfully!", { id: "logout" });
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user?.role) return "/dashboard";
    switch (user.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "SELLER":
        return "/seller/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
        aria-label="Open user menu"
      >
        <Avatar className="cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all">
          {uploading ? (
            <AvatarFallback>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
            </AvatarFallback>
          ) : (
            <>
              {user?.image && (
                <AvatarImage
                  src={user.image}
                  alt={user?.name || "User"}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                {initials}
              </AvatarFallback>
            </>
          )}
          <AvatarBadge className="bg-emerald-500 hover:bg-emerald-600 transition-colors">
            <Camera strokeWidth={2.5} className="w-3 h-3" />
          </AvatarBadge>
        </Avatar>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-14 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* User Info Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <Avatar className="w-10 h-10">
              {user?.image && (
                <AvatarImage
                  src={user.image}
                  alt={user?.name || "User"}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
              {user?.role && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-3 h-3" />
                  {user.role.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="w-4 h-4 flex-shrink-0 text-gray-500" />
              My Profile
            </Link>

            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0 text-gray-500" />
              My Orders
            </Link>

            <Link
              href={getDashboardLink()}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4 flex-shrink-0 text-gray-500" />
              Dashboard
            </Link>
          </div>

          {/* Photo Options */}
          <div className="border-t border-gray-100 dark:border-gray-800 py-1">
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Camera className="w-4 h-4 flex-shrink-0 text-gray-500" />
              {user?.image ? "Change Photo" : "Upload Photo"}
            </button>

            {user?.image && (
              <button
                onClick={handleRemovePhoto}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" />
                Remove Photo
              </button>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-800 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left font-medium"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}