"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  category: string;
  title: string;
  imgDefault: string;
  imgHover: string;
  badge?: string;
  badgeClass?: string;
  rating: number;
  newPrice: string;
  oldPrice: string;
}

const shopProducts: Product[] = [
  { id: "s1", category: "Clothing", title: "Colorful Pattern Shirt", imgDefault: "/img/product-1-1.jpg", imgHover: "/img/product-1-2.jpg", badge: "Hot", badgeClass: "light-pink", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "s2", category: "Clothing", title: "Sleek Floral Blouse", imgDefault: "/img/product-2-1.jpg", imgHover: "/img/product-2-2.jpg", badge: "Hot", badgeClass: "light-green", rating: 5, newPrice: "$120.00", oldPrice: "$145.8" },
  { id: "s3", category: "Clothing", title: "Classic Denim Jacket", imgDefault: "/img/product-3-1.jpg", imgHover: "/img/product-3-2.jpg", badge: "Hot", badgeClass: "light-orange", rating: 5, newPrice: "$340.50", oldPrice: "$390.00" },
  { id: "s4", category: "Clothing", title: "Casual Stripe Tee", imgDefault: "/img/product-4-1.jpg", imgHover: "/img/product-4-2.jpg", rating: 4, newPrice: "$95.00", oldPrice: "$110.00" },
  { id: "s5", category: "Clothing", title: "Summer Sun Dress", imgDefault: "/img/product-5-1.jpg", imgHover: "/img/product-5-2.jpg", badge: "-30%", badgeClass: "light-blue", rating: 5, newPrice: "$180.00", oldPrice: "$250.00" },
  { id: "s6", category: "Clothing", title: "Urban Cargo Pants", imgDefault: "/img/product-6-1.jpg", imgHover: "/img/product-6-2.jpg", badge: "-22%", badgeClass: "light-blue", rating: 4, newPrice: "$210.00", oldPrice: "$270.00" },
  { id: "s7", category: "Bags", title: "Leather Handbag", imgDefault: "/img/product-7-1.jpg", imgHover: "/img/product-7-2.jpg", rating: 5, newPrice: "$450.00", oldPrice: "$500.00" },
  { id: "s8", category: "Hats", title: "Knitted Winter Cap", imgDefault: "/img/product-8-1.jpg", imgHover: "/img/product-8-2.jpg", rating: 5, newPrice: "$45.00", oldPrice: "$55.00" },
  { id: "s9", category: "Bags", title: "Cozy Woolen Scarf", imgDefault: "/img/product-9-1.jpg", imgHover: "/img/product-9-2.jpg", badge: "Hot", rating: 4, newPrice: "$65.00", oldPrice: "$85.00" },
  { id: "s10", category: "Clothing", title: "Colorful Pattern Shirt", imgDefault: "/img/product-10-1.jpg", imgHover: "/img/product-10-2.jpg", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "s11", category: "Clothing", title: "Sleek Floral Blouse", imgDefault: "/img/product-11-1.jpg", imgHover: "/img/product-11-2.jpg", rating: 4, newPrice: "$120.00", oldPrice: "$145.8" },
  { id: "s12", category: "Clothing", title: "Classic Denim Jacket", imgDefault: "/img/product-12-1.jpg", imgHover: "/img/product-12-2.jpg", rating: 5, newPrice: "$340.50", oldPrice: "$390.00" },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProducts = selectedCategory === "All"
    ? shopProducts
    : shopProducts.filter(p => p.category === selectedCategory);

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
              {["All", "Clothing", "Bags", "Hats"].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                      selectedCategory === cat
                        ? "bg-emerald-50 text-emerald-800 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Filter by Price</h3>
            <div className="space-y-4">
              <input type="range" className="w-full accent-emerald-600" min="0" max="500" />
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Range: $0 - $500</span>
                <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="total__products flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              We found <span>{filteredProducts.length}</span> items for you!
            </p>
            <select className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600 bg-white">
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Release Date</option>
            </select>
          </div>

          <div className="shop-products__grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="product__item group relative">
                <div className="product__banner">
                  <Link href={`/Shop/${prod.id}`} className="product__images">
                    <Image
                      src={prod.imgDefault}
                      alt={prod.title}
                      className="product__img default w-full object-cover rounded-xl"
                      width={300}
                      height={370}
                    />
                    <Image
                      src={prod.imgHover}
                      alt={prod.title}
                      className="product__img hover w-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                      width={300}
                      height={370}
                    />
                  </Link>
                  <div className="product__actions opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/Shop/${prod.id}`} className="action__btn" aria-label="Quick View">
                      <i className="fi fi-rs-eye"></i>
                    </Link>
                    <a href="#wishlist" className="action__btn" aria-label="Add to Wishlist">
                      <i className="fi fi-rs-heart"></i>
                    </a>
                    <a href="#compare" className="action__btn" aria-label="Compare">
                      <i className="fi fi-rs-shuffle"></i>
                    </a>
                  </div>
                  {prod.badge && (
                    <div className={`product__badge ${prod.badgeClass || "light-pink"}`}>
                      {prod.badge}
                    </div>
                  )}
                </div>
                <div className="product__content">
                  <span className="product__category">{prod.category}</span>
                  <Link href={`/Shop/${prod.id}`}>
                    <h3 className="product__title font-semibold text-gray-800 hover:text-emerald-700 transition-colors">
                      {prod.title}
                    </h3>
                  </Link>
                  <div className="product__rating">
                    {Array.from({ length: prod.rating }).map((_, rIdx) => (
                      <i key={rIdx} className="fi fi-rs-star mr-1"></i>
                    ))}
                  </div>
                  <div className="product__price flex">
                    <span className="new__price">{prod.newPrice}</span>
                    <span className="old__price">{prod.oldPrice}</span>
                  </div>
                  <a href="#cart" className="action__btn cart__btn hover:scale-110 transition-transform duration-200" aria-label="Add To Cart">
                    <i className="fi fi-rs-shopping-bag-add"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <a href="#page" className="pagination__link active">1</a>
            <a href="#page" className="pagination__link">2</a>
            <a href="#page" className="pagination__link">3</a>
            <a href="#page" className="pagination__link icon">&gt;</a>
          </div>
        </div>
      </div>
    </div>
  );
}
