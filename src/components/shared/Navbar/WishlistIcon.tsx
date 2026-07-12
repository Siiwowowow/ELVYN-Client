"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface WishlistIconProps {
  onClick?: () => void;
  className?: string;
  showText?: boolean;
}

export default function WishlistIcon({ onClick, className, showText = false }: WishlistIconProps) {
  const [wishCount, setWishCount] = useState(0);

  const updateCount = () => {
    if (typeof window !== "undefined") {
      try {
        const wishlist = JSON.parse(window.localStorage.getItem("elvyn_wishlist") || "[]");
        setWishCount(wishlist.length);
      } catch (e) {
        console.error("Error reading wishlist count:", e);
        setWishCount(0);
      }
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("elvyn_wishlist_updated", updateCount);
    return () => {
      window.removeEventListener("elvyn_wishlist_updated", updateCount);
    };
  }, []);

  return (
    <Link
      href="/Wishlist"
      onClick={onClick}
      className={`relative flex items-center text-gray-700 hover:text-emerald-600 transition-colors ${className || ""}`}
      title="Wishlist"
    >
      <Heart className="w-5 h-5" />
      {wishCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
          {wishCount}
        </span>
      )}
      {showText && <span className="ml-2 font-medium text-sm">Wishlist</span>}
    </Link>
  );
}
