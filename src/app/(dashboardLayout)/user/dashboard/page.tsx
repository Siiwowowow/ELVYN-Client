/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/jsx-no-undef */
"use client"

import React, { useEffect, useState } from "react"
import { 
  IconShoppingBag, 
  IconHeart, 
  IconStar, 
  IconUser, 
  IconSettings,
  IconArrowUpRight,
  IconClock,
  IconCircleCheck,
  IconShieldLock
} from "@tabler/icons-react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"

export default function UserDashboardPage() {
  const { user } = useAuth()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const wishlist = JSON.parse(window.localStorage.getItem("elvyn_wishlist") || "[]")
        setWishlistCount(wishlist.length)

        const cart = JSON.parse(window.localStorage.getItem("elvyn_cart") || "[]")
        const totalItems = cart.reduce((acc: number, item: any) => acc + (item.qty || 1), 0)
        setCartCount(totalItems)
      } catch (err) {
        console.error("Failed to load local storage counts for dashboard:", err)
      }
    }
  }, [])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Dynamic user stats reading from local storage
  const stats = [
    {
      title: "Cart Items",
      value: String(cartCount),
      description: "Items ready for checkout",
      icon: IconShoppingBag,
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    {
      title: "My Wishlist",
      value: String(wishlistCount),
      description: "Items saved for later",
      icon: IconHeart,
      bgColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    },
    {
      title: "Product Reviews",
      value: "4",
      description: "4.8 average rating given",
      icon: IconStar,
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    {
      title: "Account Status",
      value: user?.status === "ACTIVE" ? "Active" : "Active",
      description: "Verified Secure Customer",
      icon: IconShieldLock,
      bgColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    },
  ]

  // Dummy recent orders for user
  const recentOrders = [
    { id: "ORD-9281", items: "2 items (Summer T-Shirt, Jeans)", date: "July 12, 2026", total: "$120.00", status: "Pending" },
    { id: "ORD-9023", items: "1 item (Leather Jacket)", date: "June 25, 2026", total: "$189.00", status: "Delivered" },
    { id: "ORD-8941", items: "3 items (Socks, Cotton Pants, Belt)", date: "May 14, 2026", total: "$75.20", status: "Delivered" },
  ]

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "C"

  return (
    <div className="flex flex-col gap-8 py-6 px-2 sm:px-4 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063c28] via-[#0b5439] to-[#0c4f4a] text-white p-6 sm:p-8 shadow-xl border border-emerald-800">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <IconShoppingBag size={240} className="text-white" />
        </div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl sm:text-3xl font-black text-[#def9ec] shadow-inner select-none">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                userInitial
              )}
            </div>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[#def9ec] text-xs font-bold uppercase tracking-wider">
                {user?.role || "CUSTOMER"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || "Customer"}!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
                {currentDate} • Secure Customer Portal
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link
              href="/Shop"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white hover:bg-emerald-50 px-5 text-sm font-bold text-[#063c28] transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Shop Catalog
            </Link>
            <Link
              href="/profile"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 px-5 text-sm font-semibold text-white transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div 
            key={stat.title} 
            className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wide uppercase">{stat.title}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${stat.bgColor}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</span>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1 font-medium">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Orders Card */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#def9ec] text-[#063c28] flex items-center justify-center">
                <IconShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Recent Purchases</h2>
                <p className="text-xs text-gray-400">Track and manage your order deliveries</p>
              </div>
            </div>
            <Link 
              href="/user/orders" 
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Orders</span>
              <IconArrowUpRight size={14} />
            </Link>
          </div>

          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pr-2">Order ID</th>
                  <th className="pb-3 pr-2">Purchased Items</th>
                  <th className="pb-3 pr-2">Date</th>
                  <th className="pb-3 pr-2">Total Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{order.id}</td>
                    <td className="py-4 text-gray-500 max-w-[200px] truncate pr-2">{order.items}</td>
                    <td className="py-4 text-gray-500 whitespace-nowrap pr-2">{order.date}</td>
                    <td className="py-4 font-bold text-gray-900 pr-2">{order.total}</td>
                    <td className="py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        order.status === "Pending" 
                          ? "bg-amber-50 text-amber-700 border border-amber-200" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {order.status === "Pending" ? <IconClock size={12} /> : <IconCircleCheck size={12} />}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-gray-700 flex items-center justify-center">
              <IconUser size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Quick Shortcuts</h2>
              <p className="text-xs text-gray-400">Manage password and settings</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/profile" 
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-100 bg-[#fafafa] hover:bg-[#def9ec]/30 transition-all duration-300 font-bold text-sm text-gray-700 hover:text-emerald-800 group"
            >
              <span>Edit Account Details</span>
              <IconArrowUpRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
            
            <Link 
              href="/Wishlist" 
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-100 bg-[#fafafa] hover:bg-[#def9ec]/30 transition-all duration-300 font-bold text-sm text-gray-700 hover:text-emerald-800 group"
            >
              <span>Manage Saved Wishlist</span>
              <IconArrowUpRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link 
              href="/change-password" 
              className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-100 bg-[#fafafa] hover:bg-[#def9ec]/30 transition-all duration-300 font-bold text-sm text-gray-700 hover:text-emerald-800 group"
            >
              <span>Update Password Credentials</span>
              <IconArrowUpRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
