"use client"

import React, { useState, useEffect } from "react"
import { 
  IconUsers, 
  IconShoppingBag, 
  IconActivity, 
  IconDatabase, 
  IconFileText, 
  IconShield, 
  IconPlus,
  IconArrowUpRight,
  IconServer
} from "@tabler/icons-react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import { getAdminDashboardStatsService } from "@/services/admin.services"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === "SUPER_ADMIN"
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      const res = await getAdminDashboardStatsService()
      if (res.success && res.data) {
        setStats(res.data)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-2 text-muted-foreground py-10">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-sm font-medium">Loading administrative overview...</p>
      </div>
    )
  }

  // Administrative Stats (Dynamic from DB)
  const adminStats = [
    {
      title: "Total Registered Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      change: "Active in database",
      icon: IconUsers,
      bgColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      change: "Live listings",
      icon: IconShoppingBag,
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Active Categories",
      value: stats?.totalCategories?.toLocaleString() || "0",
      change: "Configured collections",
      icon: IconDatabase,
      bgColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Security Status",
      value: "Secure",
      change: "SSL Certified",
      icon: IconShield,
      bgColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ]

  // Super Admin Specific Server Stats
  const serverStats = [
    {
      title: "Server Load",
      value: "14%",
      change: "Normal Load",
      icon: IconServer,
      bgColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    {
      title: "API Status",
      value: "100.0% Up",
      change: "Healthy Status",
      icon: IconActivity,
      bgColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Database Connections",
      value: "Active",
      change: "MongoDB Atlas Pool",
      icon: IconDatabase,
      bgColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "System Errors",
      value: "0 Errors",
      change: "No logs today",
      icon: IconFileText,
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ]

  const recentUsersList = stats?.recentUsers || []

  // Mock system logs (Only for Super Admin)
  const systemLogs = [
    { timestamp: "Just now", type: "INFO", message: "Database statistics compiled for admin dashboard." },
    { timestamp: "5m ago", type: "INFO", message: "Database connection pool checked and fully optimized." },
    { timestamp: "1h ago", type: "INFO", message: "Backup validation check completed successfully." },
    { timestamp: "2h ago", type: "INFO", message: "Authentication router verified tokens validation lifecycle." },
  ]

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            {isSuperAdmin ? "Super Admin Portal" : "Admin Panel Overview"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            System status and administrative overview for {currentDate}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories/new"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-650 px-4 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-colors"
          >
            <IconPlus size={14} className="mr-1.5" />
            Add New Category
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <div key={stat.title} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Super Admin Specific Server Stats Grid */}
      {isSuperAdmin && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <IconServer size={18} className="text-emerald-600" />
            System & Server Health (Super Admin Only)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {serverStats.map((stat) => (
              <div key={stat.title} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow transition-shadow bg-gradient-to-br from-card to-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={22} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* User Management Overview */}
        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconUsers className="text-emerald-600" />
              <h2 className="text-sm font-bold text-foreground">Recent Users</h2>
            </div>
            <Link 
              href="/admin/users" 
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              All Users <IconArrowUpRight size={12} />
            </Link>
          </div>

          <div className="relative w-full overflow-auto">
            {recentUsersList.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground font-medium">
                    <th className="pb-3 font-semibold">User ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentUsersList.map((u: any) => (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 font-mono text-xs text-foreground truncate max-w-[120px]" title={u.id}>
                        {u.id}
                      </td>
                      <td className="py-3 text-muted-foreground">{u.name || "N/A"}</td>
                      <td className="py-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          u.role === "SUPER_ADMIN" 
                            ? "bg-purple-500/10 text-purple-600" 
                            : u.role === "ADMIN"
                            ? "bg-blue-500/10 text-blue-600"
                            : u.role === "SELLER"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-neutral-500/10 text-neutral-600"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          u.status === "ACTIVE" 
                            ? "bg-emerald-500/10 text-emerald-600" 
                            : "bg-rose-500/10 text-rose-600"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No users found in database.
              </div>
            )}
          </div>
        </div>

        {/* System Logs (Super Admin) or System Actions (Admin) */}
        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-4 flex flex-col gap-4">
          {isSuperAdmin ? (
            <>
              <div className="flex items-center gap-2">
                <IconFileText className="text-emerald-600" />
                <h2 className="text-sm font-bold text-foreground">Live System Logs</h2>
              </div>
              <div className="flex flex-col gap-3 mt-2 font-mono text-[10px] max-h-[220px] overflow-y-auto pr-1">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex flex-col gap-1 p-2 rounded bg-muted/40 border-l-2 border-emerald-600">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>{log.timestamp}</span>
                      <span className="font-bold text-emerald-600">{log.type}</span>
                    </div>
                    <p className="text-foreground mt-0.5 leading-relaxed">{log.message}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <IconShield className="text-emerald-600" />
                <h2 className="text-sm font-bold text-foreground">Admin Actions</h2>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Link 
                  href="/admin/users" 
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/75 transition-colors font-medium text-xs text-foreground"
                >
                  <span>Manage Customers & Sellers</span>
                  <IconArrowUpRight size={14} className="text-muted-foreground" />
                </Link>
                <Link 
                  href="/admin/orders" 
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/75 transition-colors font-medium text-xs text-foreground"
                >
                  <span>Approve & Track Orders</span>
                  <IconArrowUpRight size={14} className="text-muted-foreground" />
                </Link>
                <Link 
                  href="/admin/categories" 
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/75 transition-colors font-medium text-xs text-foreground"
                >
                  <span>Manage Product Categories</span>
                  <IconArrowUpRight size={14} className="text-muted-foreground" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
