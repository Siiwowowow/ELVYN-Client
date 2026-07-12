"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface WishlistItem {
  id: string;
  title: string;
  img: string;
  price: number;
  inStock: boolean;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: "w1", title: "Trendy Designs & Pattern Shirts", img: "/img/product-3-1.jpg", price: 139.00, inStock: true },
    { id: "w2", title: "Active & Summer Collection", img: "/img/product-5-1.jpg", price: 119.00, inStock: true },
    { id: "w3", title: "Casual Stripe Tee", img: "/img/product-4-1.jpg", price: 95.00, inStock: false },
  ]);

  const removeItem = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
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

      <h2 className="section__title text-2xl font-bold mb-6">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg mb-4">Your wishlist is currently empty.</p>
          <Link href="/Shop" className="btn btn--sm">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm font-semibold text-gray-500">
                <th className="py-4">Product</th>
                <th className="py-4">Price</th>
                <th className="py-4">Stock Status</th>
                <th className="py-4">Action</th>
                <th className="py-4">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {wishlistItems.map((item) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="py-4 flex items-center gap-4">
                    <Image src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" width={64} height={64} />
                    <span className="font-medium text-sm text-gray-800">{item.title}</span>
                  </td>
                  <td className="py-4 text-sm font-semibold">${item.price.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.inStock
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-800"
                    }`}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      disabled={!item.inStock}
                      className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                        item.inStock
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Add to Cart
                    </button>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <i className="fi fi-rs-cross-small text-lg"></i>
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
