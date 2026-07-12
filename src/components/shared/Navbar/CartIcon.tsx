"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export default function CartIcon({ onClick, className, showText = false }: CartIconProps) {
  const [cartCount, setCartCount] = useState(0);

  const updateCount = () => {
    if (typeof window !== "undefined") {
      try {
        const cart = JSON.parse(window.localStorage.getItem("elvyn_cart") || "[]");
        const total = cart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0);
        setCartCount(total);
      } catch (e) {
        console.error("Error reading cart count:", e);
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("elvyn_cart_updated", updateCount);
    return () => {
      window.removeEventListener("elvyn_cart_updated", updateCount);
    };
  }, []);

  return (
    <Link
      href="/Cart"
      onClick={onClick}
      className={`relative flex items-center text-gray-700 hover:text-emerald-600 transition-colors ${className || ""}`}
      title="Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
          {cartCount}
        </span>
      )}
      {showText && <span className="ml-2 font-medium text-sm">Cart</span>}
    </Link>
  );
}
