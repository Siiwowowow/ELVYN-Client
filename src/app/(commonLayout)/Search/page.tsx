"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Search, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { getAllProductsService } from "@/services/product.services";
import { useUser } from "@/hooks/useUser";

interface Product {
  id: string;
  title: string;
  imgDefault: string;
  imgHover: string;
  badge?: string | null;
  badgeClass?: string | null;
  rating: number;
  newPrice: number;
  oldPrice: number;
  categoryId: string;
  category?: { name: string };
}

export default function SearchPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") || "" : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    const res = await getAllProductsService({ searchTerm: query });
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      toast.error("Failed to load search results.");
    }
    setLoading(false);
  };

  const handleAddToCart = (e: React.MouseEvent, prod: Product) => {
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
        if (existingIndex > -1) {
          cart[existingIndex].qty += 1;
        } else {
          cart.push({
            id: prod.id,
            title: prod.title,
            img: prod.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
            price: prod.newPrice,
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

  const handleAddToWishlist = (e: React.MouseEvent, prod: Product) => {
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
        if (!exists) {
          wishlist.push({
            id: prod.id,
            title: prod.title,
            img: prod.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
            price: prod.newPrice,
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
    <div className="container section">
      {/*=============== BREADCRUMBS ===============*/}
      <div className="breadcrumb mb-8 py-4 px-6 rounded-xl bg-gray-50">
        <ul className="breadcrumb__list flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="breadcrumb__link hover:text-emerald-700">Home</Link></li>
          <li>&gt;</li>
          <li className="font-semibold text-emerald-800">Search</li>
        </ul>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Search className="text-emerald-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">
          Search Results {query && <span>for "{query}"</span>}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-sm font-semibold">Searching catalog database...</p>
        </div>
      ) : products.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 mb-6">
            We found <span className="font-bold text-emerald-700">{products.length}</span> items matching your search!
          </p>

          <div className="shop-products__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => {
              const prodImg = prod.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png";
              const prodImgHover = prod.imgHover || prodImg;

              return (
                <div key={prod.id} className="product__item group relative">
                  <div className="product__banner">
                    <Link href={`/Shop/${prod.id}`} className="product__images block relative overflow-hidden rounded-xl h-[280px]">
                      <Image
                        src={prodImg}
                        alt={prod.title}
                        className="product__img default w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        width={300}
                        height={370}
                        unoptimized
                      />
                      <Image
                        src={prodImgHover}
                        alt={prod.title}
                        className="product__img hover w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl group-hover:scale-105"
                        width={300}
                        height={370}
                        unoptimized
                      />
                    </Link>
                    <div className="product__actions opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/Shop/${prod.id}`} className="action__btn" aria-label="Quick View">
                        <i className="fi fi-rs-eye"></i>
                      </Link>
                      <button
                        onClick={(e) => handleAddToWishlist(e, prod)}
                        className="action__btn cursor-pointer"
                        aria-label="Add to Wishlist"
                      >
                        <i className="fi fi-rs-heart"></i>
                      </button>
                    </div>
                    {prod.badge && (
                      <div className={`product__badge ${prod.badgeClass || "light-pink"}`}>
                        {prod.badge}
                      </div>
                    )}
                  </div>
                  <div className="product__content mt-4">
                    <span className="product__category">{prod.category?.name || "Uncategorized"}</span>
                    <Link href={`/Shop/${prod.id}`}>
                      <h3 className="product__title font-semibold text-gray-800 hover:text-emerald-700 transition-colors text-sm truncate">
                        {prod.title}
                      </h3>
                    </Link>
                    <div className="product__rating text-amber-450 my-1">
                      {Array.from({ length: Math.round(prod.rating || 5) }).map((_, rIdx) => (
                        <i key={rIdx} className="fi fi-rs-star mr-1"></i>
                      ))}
                    </div>
                    <div className="product__price flex items-center gap-2 mt-1">
                      <span className="new__price text-emerald-650 font-bold">${prod.newPrice.toFixed(2)}</span>
                      {prod.oldPrice > prod.newPrice && (
                        <span className="old__price text-gray-400 line-through text-xs">${prod.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="action__btn cart__btn hover:scale-110 transition-transform duration-200 cursor-pointer absolute bottom-4 right-4 bg-emerald-50 text-emerald-650 border border-emerald-100 hover:bg-emerald-600 hover:text-white"
                      aria-label="Add To Cart"
                    >
                      <i className="fi fi-rs-shopping-bag-add"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Search className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Items Found</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            We couldn't find any items matching "{query}". Please check your spelling or try searching for another keyword.
          </p>
          <div className="mt-8">
            <Link href="/Shop" className="btn btn--sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-1.5">
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
