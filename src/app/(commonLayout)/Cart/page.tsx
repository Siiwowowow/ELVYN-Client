"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  img: string;
  price: number;
  qty: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "c1", title: "Colorful Pattern Shirts", img: "/img/product-1-1.jpg", price: 238.85, qty: 1 },
    { id: "c2", title: "Sleek Floral Blouse", img: "/img/product-2-1.jpg", price: 120.00, qty: 2 },
    { id: "c3", title: "Knitted Winter Cap", img: "/img/product-8-1.jpg", price: 45.00, qty: 1 },
  ]);

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const subtotal = getSubtotal();
  const shipping = subtotal > 300 ? 0 : 20.00;
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

      <h2 className="section__title text-2xl font-bold mb-6">Your Cart Items</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg mb-4">Your cart is currently empty.</p>
          <Link href="/Shop" className="btn btn--sm">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-sm font-semibold text-gray-500">
                    <th className="py-4">Product</th>
                    <th className="py-4">Price</th>
                    <th className="py-4">Quantity</th>
                    <th className="py-4">Subtotal</th>
                    <th className="py-4">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="text-gray-700">
                      <td className="py-4 flex items-center gap-4">
                        <Image src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" width={64} height={64} />
                        <span className="font-medium text-sm text-gray-800">{item.title}</span>
                      </td>
                      <td className="py-4 text-sm font-semibold">${item.price.toFixed(2)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQtyChange(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-emerald-800">${(item.price * item.qty).toFixed(2)}</td>
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

            {/* Cart Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="border rounded-lg px-4 py-2 text-sm w-full md:w-48 bg-white"
                />
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
                  Apply Coupon
                </button>
              </div>
              <button
                onClick={() => setCartItems([])}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors w-full md:w-auto"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Totals Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 pb-2 border-b">Cart Totals</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">
                  {shipping === 0 ? "Free Shipping" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-800">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
