"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, ShoppingCart, Heart, ArrowRight } from "lucide-react";

interface WishlistItem {
  id: string;
  title: string;
  img: string;
  price: number;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(window.localStorage.getItem("elvyn_wishlist") || "[]");
        setWishlistItems(stored);
      } catch (e) {
        console.error("Failed to load wishlist:", e);
      }
      setLoading(false);
    }
  }, []);

  const removeItem = (id: string) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("elvyn_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("elvyn_wishlist_updated"));
    }
    toast.success("Item removed from wishlist.");
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (typeof window !== "undefined") {
      try {
        // Add to cart
        const cart = JSON.parse(window.localStorage.getItem("elvyn_cart") || "[]");
        const existingIndex = cart.findIndex((c: any) => c.id === item.id);
        if (existingIndex > -1) {
          cart[existingIndex].qty += 1;
        } else {
          cart.push({
            id: item.id,
            title: item.title,
            img: item.img,
            price: item.price,
            qty: 1
          });
        }
        window.localStorage.setItem("elvyn_cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("elvyn_cart_updated"));

        // Remove from wishlist
        const updatedWishlist = wishlistItems.filter(w => w.id !== item.id);
        setWishlistItems(updatedWishlist);
        window.localStorage.setItem("elvyn_wishlist", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("elvyn_wishlist_updated"));

        toast.success(`"${item.title}" moved to shopping cart!`);
      } catch (err) {
        console.error("Add to cart error:", err);
      }
    }
  };

  return (
    <div className="container section">
      {/*=============== BREADCRUMBS ===============*/}
      <div className="breadcrumb mb-8 py-4 px-6 rounded-xl bg-gray-50">
        <ul className="breadcrumb__list flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="breadcrumb__link hover:text-emerald-700">Home</Link></li>
          <li>&gt;</li>
          <li><Link href="/Shop" className="breadcrumb__link hover:text-emerald-700">Shop</Link></li>
          <li>&gt;</li>
          <li className="font-semibold text-emerald-800">Wishlist</li>
        </ul>
      </div>

      <h2 className="section__title text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="text-emerald-600" size={24} />
        <span>Your Wishlist</span>
      </h2>

      {loading ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin text-emerald-600" size={24} />
          <span>Syncing wishlist...</span>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Heart className="mx-auto text-gray-250 mb-3" size={48} />
          <p className="text-gray-500 text-lg mb-4 font-semibold">Your wishlist is currently empty.</p>
          <Link href="/Shop" className="btn btn--sm bg-emerald-600 hover:bg-emerald-750 text-white font-bold py-2 px-6 rounded-xl transition-colors inline-flex items-center gap-1">
            <span>Discover Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b text-sm font-semibold text-gray-500">
                <th className="py-4 px-4">Product</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wishlistItems.map((item) => (
                <tr key={item.id} className="text-gray-700 hover:bg-slate-50/30 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <div className="w-16 h-16 relative overflow-hidden rounded-lg border bg-slate-50 shrink-0">
                      <Image
                        src={item.img}
                        alt={item.title}
                        className="object-cover"
                        fill
                        sizes="64px"
                        unoptimized
                      />
                    </div>
                    <span className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-800">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.inStock !== false
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                        : "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                      {item.inStock !== false ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.inStock === false}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                        item.inStock !== false
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Simple loader helper
function Loader2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-2 ${className || ""}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
