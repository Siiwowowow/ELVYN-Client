"use client";

import SellerSidebar from "@/components/layout/SellerSidebar";
import React, { useState } from "react";
import { SELLER_ROUTES } from "@/constants/sellerRoutes";
import ProductsContent from "@/components/seller/ProductsContent";
import { Menu } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function SellerLayout() {
  // Start collapsed by default so the sidebar drawer starts closed on mobile.
  const [collapsed, setCollapsed] = useState(true);
  const [activeRoute, setActiveRoute] = useState("products");
  const { user } = useUser();

  const current = SELLER_ROUTES.find((r) => r.id === activeRoute)!;

  return (
    <div className="flex bg-slate-100 min-h-screen w-full relative">
      <SellerSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
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

        <div className="p-4 md:p-6">


          {activeRoute === "products" ? (
            <ProductsContent />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
              <p className="text-sm">
                Route content for{" "}
                <span className="font-medium text-slate-600">
                  {current.label}
                </span>{" "}
                renders here.
              </p>
              <p className="text-xs mt-1">
                Wire this up to your CRUD table / form for{" "}
                <code>{current.path}</code>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


