"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  UserCheck, 
  UserX, 
  ShieldAlert,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { 
  getAllUsersService, 
  updateUserRoleService, 
  updateUserStatusService, 
  deleteUserService 
} from "@/services/admin.services";
import { useAuth } from "@/providers/AuthProvider";

interface UserAccount {
  id: string;
  name?: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "SELLER" | "CUSTOMER" | "USER";
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  image?: string | null;
  createdAt: string;
}

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Actions states
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    const query: Record<string, string> = {};
    if (searchTerm.trim()) {
      query.searchTerm = searchTerm.trim();
    }
    if (roleFilter) {
      query.role = roleFilter;
    }

    const res = await getAllUsersService(query);
    if (res.success && res.data) {
      setUsers(res.data);
    } else {
      toast.error(res.message || "Failed to load users list");
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      toast.warning("You cannot change your own role!");
      return;
    }

    setUpdatingId(userId);
    const res = await updateUserRoleService(userId, newRole);
    if (res.success) {
      toast.success("User role updated successfully!");
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to change user role");
    }
    setUpdatingId(null);
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    if (userId === currentUser?.id) {
      toast.warning("You cannot block yourself!");
      return;
    }

    const targetStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setUpdatingId(userId);
    const res = await updateUserStatusService(userId, targetStatus);
    if (res.success) {
      toast.success(`User status updated to ${targetStatus}!`);
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to update user status");
    }
    setUpdatingId(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast.warning("You cannot delete your own account!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user? This action will invalidate all their sessions.")) {
      setUpdatingId(userId);
      const res = await deleteUserService(userId);
      if (res.success) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error(res.message || "Failed to delete user");
      }
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="text-emerald-600" size={24} />
            <span>User Accounts Control</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage permissions, modify user status, and delete customer or seller accounts.
          </p>
        </div>

        <button 
          onClick={fetchUsers}
          className="p-2 rounded-lg border bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          title="Refresh User Data"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="SELLER">Seller</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          {loading && users.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-sm font-medium">Fetching accounts from database...</p>
            </div>
          ) : users.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role Permission</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {users.map((u) => {
                  const isMe = u.id === currentUser?.id;
                  const isUpdating = updatingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name / Email */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 shadow-sm border border-emerald-50">
                          {u.image ? (
                            <img src={u.image} alt={u.name || "User"} className="object-cover w-full h-full" />
                          ) : (
                            <span>{u.name?.charAt(0).toUpperCase() || "U"}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                            <span>{u.name || "Unnamed User"}</span>
                            {isMe && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">{u.email}</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-700 border border-emerald-100"
                            : "bg-rose-500/10 text-rose-700 border border-rose-100"
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      {/* Role selection dropdown */}
                      <td className="px-6 py-4">
                        {isMe || u.role === "SUPER_ADMIN" ? (
                          <span className="text-xs font-bold text-slate-700 uppercase bg-slate-100 border px-2.5 py-1 rounded-lg">
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="text-xs font-semibold text-slate-700 uppercase border border-slate-200 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="SELLER">Seller</option>
                            <option value="CUSTOMER">Customer</option>
                          </select>
                        )}
                      </td>

                      {/* Action operations */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle active / block status */}
                          {!isMe && u.role !== "SUPER_ADMIN" && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusToggle(u.id, u.status)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                u.status === "ACTIVE"
                                  ? "text-slate-400 hover:text-rose-500 border-slate-200 hover:bg-rose-50"
                                  : "text-slate-400 hover:text-emerald-500 border-slate-200 hover:bg-emerald-50"
                              } disabled:opacity-50`}
                              title={u.status === "ACTIVE" ? "Block Account" : "Activate Account"}
                            >
                              {u.status === "ACTIVE" ? <UserX size={15} /> : <UserCheck size={15} />}
                            </button>
                          )}

                          {/* Delete Account */}
                          {!isMe && u.role !== "SUPER_ADMIN" && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <ShieldAlert className="mx-auto text-slate-350 mb-2" size={36} />
              <p className="text-sm">No accounts found in database matching criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
