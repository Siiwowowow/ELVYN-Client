/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { featuredProducts, popularProducts, newAddedProducts } from "./data";
import { useUser } from "@/hooks/useUser";

export default function ProductsTabbed() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<
    "featured" | "popular" | "new-added"
  >("featured");

  const getProductsForTab = () => {
    if (activeTab === "popular") return popularProducts;
    if (activeTab === "new-added") return newAddedProducts;
    return featuredProducts;
  };

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add items to your cart!");
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const cart = JSON.parse(window.localStorage.getItem("elvyn_cart") || "[]");
        const existingIndex = cart.findIndex((item: any) => item.id === prod.id);
        
        const priceNum = typeof prod.newPrice === "string" 
          ? parseFloat(prod.newPrice.replace(/[^0-9.]/g, "")) 
          : Number(prod.newPrice || 0);

        if (existingIndex > -1) {
          cart[existingIndex].qty += 1;
        } else {
          cart.push({
            id: prod.id,
            title: prod.title,
            img: prod.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
            price: priceNum,
            qty: 1
          });
        }
        window.localStorage.setItem("elvyn_cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("elvyn_cart_updated"));
        toast.success(`"${prod.title}" added to shopping cart!`);
      } catch (err) {
        console.error("Cart error:", err);
      }
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent, prod: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add items to your wishlist!");
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }

    if (typeof window !== "undefined") {
      try {
        const wishlist = JSON.parse(window.localStorage.getItem("elvyn_wishlist") || "[]");
        const exists = wishlist.some((item: any) => item.id === prod.id);

        const priceNum = typeof prod.newPrice === "string" 
          ? parseFloat(prod.newPrice.replace(/[^0-9.]/g, "")) 
          : Number(prod.newPrice || 0);

        if (!exists) {
          wishlist.push({
            id: prod.id,
            title: prod.title,
            img: prod.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
            price: priceNum,
            inStock: true
          });
          window.localStorage.setItem("elvyn_wishlist", JSON.stringify(wishlist));
          window.dispatchEvent(new Event("elvyn_wishlist_updated"));
          toast.success(`"${prod.title}" added to wishlist!`);
        } else {
          toast.info(`"${prod.title}" is already in your wishlist!`);
        }
      } catch (err) {
        console.error("Wishlist error:", err);
      }
    }
  };

  return (
    <section id="shop" className="products container section py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="tab__btns flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8">
        <span
          className={`tab__btn text-[10px] sm:text-xs md:text-sm lg:text-base px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeTab === "featured"
              ? "active-tab bg-[#fcf0e4] text-[#063c28] font-semibold"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("featured")}
        >
          Featured
        </span>
        <span
          className={`tab__btn text-[10px] sm:text-xs md:text-sm lg:text-base px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeTab === "popular"
              ? "active-tab bg-[#fcf0e4] text-[#063c28] font-semibold"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("popular")}
        >
          Popular
        </span>
        <span
          className={`tab__btn text-[10px] sm:text-xs md:text-sm lg:text-base px-2.5 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 ${
            activeTab === "new-added"
              ? "active-tab bg-[#fcf0e4] text-[#063c28] font-semibold"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("new-added")}
        >
          New Added
        </span>
      </div>

      <div className="tab__items">
        <div className="products__container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {getProductsForTab().map((prod) => (
            <div
              key={prod.id}
              className="product__item group relative bg-white border border-emerald-100 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image area */}
              <div className="product__banner relative bg-[#f4f4f4] m-2 sm:m-2.5 md:m-3 rounded-xl sm:rounded-2xl overflow-hidden">
                <Link
                  href={`/Shop/${prod.id}`}
                  className="product__images block relative overflow-hidden aspect-[4/3] sm:aspect-[4/3.4]"
                >
                  <Image
                    src={prod.imgDefault}
                    alt={prod.title}
                    className="product__img default w-full h-full object-contain p-4 sm:p-5 md:p-6 transition-all duration-500"
                    width={300}
                    height={260}
                    unoptimized
                  />
                  <Image
                    src={prod.imgHover}
                    alt={prod.title}
                    className="product__img hover w-full h-full object-contain p-4 sm:p-5 md:p-6 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    width={300}
                    height={260}
                    unoptimized
                  />
                </Link>

                {prod.badge && (
                  <div
                    className={`product__badge absolute top-2 sm:top-2.5 md:top-3 left-2 sm:left-2.5 md:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white text-[8px] sm:text-[9px] md:text-[10px] font-semibold shadow-sm ${
                      prod.badgeClass === "light-pink"
                        ? "bg-rose-400"
                        : prod.badgeClass === "light-green"
                        ? "bg-emerald-400"
                        : prod.badgeClass === "light-orange"
                        ? "bg-amber-400"
                        : "bg-sky-400"
                    }`}
                  >
                    {prod.badge}
                  </div>
                )}

                {/* Quick actions on hover */}
                <div className="product__actions absolute inset-0 flex items-center justify-center gap-2 sm:gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/0 group-hover:bg-black/5">
                  <Link
                    href={`/Shop/${prod.id}`}
                    className="action__btn w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-[#063c28] hover:text-white hover:scale-110 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0"
                    aria-label="Quick View"
                  >
                    <i className="fi fi-rs-eye text-xs sm:text-sm"></i>
                  </Link>
                  <button
                    onClick={(e) => handleAddToWishlist(e, prod)}
                    className="action__btn w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-[#063c28] hover:text-white hover:scale-110 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 delay-75 cursor-pointer"
                    aria-label="Add to Wishlist"
                  >
                    <i className="fi fi-rs-heart text-xs sm:text-sm"></i>
                  </button>
                  <Link
                    href="#compare"
                    className="action__btn w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-[#063c28] hover:text-white hover:scale-110 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0 delay-150"
                    aria-label="Compare"
                  >
                    <i className="fi fi-rs-shuffle text-xs sm:text-sm"></i>
                  </Link>
                </div>

                {/* Cart button - side of image */}
                <button
                  onClick={(e) => handleAddToCart(e, prod)}
                  className="cart__btn absolute bottom-2 sm:bottom-2.5 md:bottom-3 right-2 sm:right-2.5 md:right-3 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center bg-white text-[#063c28] rounded-full shadow-md hover:bg-[#063c28] hover:text-white hover:scale-110 transition-all duration-300 border border-gray-100 hover:border-[#063c28] z-10 cursor-pointer"
                  aria-label="Add To Cart"
                >
                  <i className="fi fi-rs-shopping-bag-add text-xs sm:text-sm"></i>
                </button>
              </div>

              {/* Content area */}
              <div className="product__content px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 pt-0.5 sm:pt-1 flex flex-col flex-1">
                <span className="product__category text-[9px] sm:text-[10px] md:text-xs text-gray-400">
                  {prod.category}
                </span>
                <Link href={`/Shop/${prod.id}`}>
                  <h3 className="product__title font-semibold text-gray-900 hover:text-emerald-700 transition-colors text-[11px] sm:text-xs md:text-sm lg:text-base leading-tight mt-0.5 sm:mt-1 line-clamp-2">
                    {prod.title}
                  </h3>
                </Link>
                <div className="product__rating flex text-amber-400 text-[9px] sm:text-[10px] md:text-xs mt-1 sm:mt-1.5">
                  {Array.from({ length: 5 }).map((_, rIdx) => (
                    <i
                      key={rIdx}
                      className={`fi fi-rs-star mr-0.5 ${
                        rIdx < prod.rating ? "text-amber-400" : "text-gray-200"
                      }`}
                    ></i>
                  ))}
                </div>

                <div className="product__price flex items-baseline gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
                  <span className="new__price text-emerald-600 font-bold text-xs sm:text-sm md:text-base">
                    {prod.newPrice}
                  </span>
                  <span className="old__price text-gray-400 text-[9px] sm:text-[10px] md:text-xs line-through">
                    {prod.oldPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}