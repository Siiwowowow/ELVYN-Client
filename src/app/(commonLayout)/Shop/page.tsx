/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { getAllCategoriesService, getAllProductsService } from "@/services/product.services";
import { useUser } from "@/hooks/useUser";

interface Category {
  id: string;
  name: string;
  img: string;
}

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
  category?: Category;
}

export default function ShopPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter, Sorting & Pagination state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(500);
  const [sorting, setSorting] = useState<string>("Default Sorting");
  
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6); // 6 products per page
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Load categories once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when page, category, price, or sorting changes
  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, priceRange, sorting]);

  const fetchCategories = async () => {
    const res = await getAllCategoriesService();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const query: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };

    if (selectedCategory !== "All") {
      query.category = selectedCategory;
    }

    if (priceRange < 500) {
      query.maxPrice = String(priceRange);
    }

    // Apply sorting logic
    if (sorting === "Price: Low to High") {
      query.sortBy = "newPrice";
      query.sortOrder = "asc";
    } else if (sorting === "Price: High to Low") {
      query.sortBy = "newPrice";
      query.sortOrder = "desc";
    } else if (sorting === "Release Date") {
      query.sortBy = "createdAt";
      query.sortOrder = "desc";
    }

    const res = await getAllProductsService(query);
    if (res.success && res.data) {
      setProducts(res.data);
      if (res.meta) {
        setTotalPage(res.meta.totalPage || 1);
        setTotalProducts(res.meta.total || 0);
      }
    } else {
      toast.error(res.message || "Failed to load products");
    }
    setIsLoading(false);
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setPage(1); // Reset to page 1 on category change
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
          <li className="font-semibold text-emerald-800">Shop</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                    selectedCategory === "All"
                      ? "bg-emerald-50 text-emerald-850 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                      selectedCategory === cat.name
                        ? "bg-emerald-50 text-emerald-855 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Filter by Price</h3>
            <div className="space-y-4">
              <input
                type="range"
                className="w-full accent-emerald-600 cursor-pointer"
                min="0"
                max="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                <span>Max: ${priceRange}</span>
                <button
                  onClick={fetchProducts}
                  className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Apply Limit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="total__products flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              We found <span className="font-bold text-emerald-700">{totalProducts}</span> items for you!
            </p>
            <select
              value={sorting}
              onChange={(e) => {
                setSorting(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Release Date</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-500">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-sm font-medium">Loading catalog products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="shop-products__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

              {/* Dynamic Pagination Controls */}
              {totalPage > 1 && (
                <div className="pagination flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPage }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`pagination__link cursor-pointer px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${
                          page === pageNum
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-650 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {page < totalPage && (
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      className="pagination__link icon cursor-pointer px-4 py-2 border rounded-lg text-sm font-semibold border-gray-200 bg-white hover:bg-gray-50"
                    >
                      &gt;
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400 border border-dashed rounded-xl bg-gray-50/50">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm font-medium">No products matched the active filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
