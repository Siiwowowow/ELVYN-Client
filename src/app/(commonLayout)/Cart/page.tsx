"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  img: string;
  price: number;
  qty: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(window.localStorage.getItem("elvyn_cart") || "[]");
        setCartItems(stored);
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
      setLoading(false);
    }
  }, []);

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item => item.id === id ? { ...item, qty: newQty } : item);
    setCartItems(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("elvyn_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("elvyn_cart_updated"));
    }
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("elvyn_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("elvyn_cart_updated"));
    }
    toast.success("Item removed from cart.");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your shopping cart?")) {
      setCartItems([]);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("elvyn_cart", JSON.stringify([]));
        window.dispatchEvent(new Event("elvyn_cart_updated"));
      }
      toast.success("Cart cleared.");
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 20.00;
  const total = subtotal + shipping;

  return (
    <div className="container section">
      {/*=============== BREADCRUMBS ===============*/}
      <div className="breadcrumb mb-8 py-4 px-6 rounded-xl bg-gray-50">
        <ul className="breadcrumb__list flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="breadcrumb__link hover:text-emerald-700">Home</Link></li>
          <li>&gt;</li>
          <li><Link href="/Shop" className="breadcrumb__link hover:text-emerald-700">Shop</Link></li>
          <li>&gt;</li>
          <li className="font-semibold text-emerald-800">Cart</li>
        </ul>
      </div>

      <h2 className="section__title text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="text-emerald-600" size={24} />
        <span>Your Shopping Cart</span>
      </h2>

      {loading ? (
        <div className="text-center py-12 flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin text-emerald-600" size={24} />
          <span>Syncing cart...</span>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag className="mx-auto text-gray-250 mb-3" size={48} />
          <p className="text-gray-500 text-lg mb-4 font-semibold">Your shopping cart is currently empty.</p>
          <Link href="/Shop" className="btn btn--sm bg-emerald-600 hover:bg-emerald-750 text-white font-bold py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-1">
            <ArrowLeft size={14} />
            <span>Go Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b text-sm font-semibold text-gray-500">
                    <th className="py-4 px-2">Product</th>
                    <th className="py-4 px-2">Price</th>
                    <th className="py-4 px-2 text-center">Quantity</th>
                    <th className="py-4 px-2">Subtotal</th>
                    <th className="py-4 px-2 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="text-gray-700 hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-2 flex items-center gap-4">
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
                      <td className="py-4 px-2 text-sm font-semibold text-slate-800">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQtyChange(item.id, item.qty - 1)}
                            className="w-7 h-7 rounded border border-gray-250 flex items-center justify-center hover:bg-gray-100 font-bold cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, item.qty + 1)}
                            className="w-7 h-7 rounded border border-gray-250 flex items-center justify-center hover:bg-gray-100 font-bold cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm font-bold text-emerald-800">${(item.price * item.qty).toFixed(2)}</td>
                      <td className="py-4 px-2 text-center">
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

            {/* Cart Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="border border-gray-250 rounded-lg px-4 py-2 text-sm w-full md:w-48 bg-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={() => toast.success("Coupon code applied!")}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={handleClearCart}
                className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full md:w-auto cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Totals Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 pb-2 border-b">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-750">
                  {shipping === 0 ? "Free Shipping" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t">
                <span>Grand Total</span>
                <span className="text-emerald-800">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => toast.success("Checkout process simulated successfully!")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loader icon
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
