"use client";

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Save, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Profile forms state
  const [name, setName] = useState(user?.name || "Admin User");
  const [email] = useState(user?.email || "admin@example.com");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate updating name
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Administrative details updated successfully!");
    }, 800);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Security credentials modified successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="text-emerald-600" size={24} />
          <span>Console Settings</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure administrative configurations, update personal profile credentials, and adjust security keys.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Profile Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-800">
            <User className="text-emerald-600" size={18} />
            <h2 className="text-sm font-bold">Profile Details</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Account Email (Static) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="email">
                Account Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Admin Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="admin-name">
                Full Display Name
              </label>
              <input
                id="admin-name"
                type="text"
                placeholder="e.g. David Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Account Role details */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 mt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={16} />
                <span className="text-xs text-slate-650 font-medium">Administrative Role Authorization:</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {user?.role || "ADMIN"}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-800">
            <KeyRound className="text-emerald-600" size={18} />
            <h2 className="text-sm font-bold">Security Credentials</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="curr-pass">
                Current Password
              </label>
              <input
                id="curr-pass"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="new-pass">
                New Password
              </label>
              <input
                id="new-pass"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600" htmlFor="confirm-pass">
                Confirm New Password
              </label>
              <input
                id="confirm-pass"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Update Credentials</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
