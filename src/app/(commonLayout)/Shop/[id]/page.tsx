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

// Mock database combining products from Home and Shop
const allProducts: Product[] = [
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
  { id: "f1", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-1-1.jpg", imgHover: "/img/product-1-2.jpg", badge: "Hot", badgeClass: "light-pink", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f2", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-2-1.jpg", imgHover: "/img/product-2-2.jpg", badge: "Hot", badgeClass: "light-green", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f3", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-3-1.jpg", imgHover: "/img/product-3-2.jpg", badge: "Hot", badgeClass: "light-orange", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f4", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-4-1.jpg", imgHover: "/img/product-4-2.jpg", badge: "Hot", badgeClass: "light-blue", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f5", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-5-1.jpg", imgHover: "/img/product-5-2.jpg", badge: "-30%", badgeClass: "light-blue", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f6", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-6-1.jpg", imgHover: "/img/product-6-2.jpg", badge: "-22%", badgeClass: "light-blue", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f7", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-7-1.jpg", imgHover: "/img/product-7-2.jpg", badge: "-22%", badgeClass: "light-green", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
  { id: "f8", category: "Clothing", title: "Colorful Pattern Shirts", imgDefault: "/img/product-8-1.jpg", imgHover: "/img/product-8-2.jpg", rating: 5, newPrice: "$238.85", oldPrice: "$245.8" },
];

const fallbackProduct: Product = {
  id: "default",
  category: "Fashion",
  title: "Henley Shirt",
  imgDefault: "/img/product-8-1.jpg",
  imgHover: "/img/product-8-2.jpg",
  rating: 5,
  newPrice: "$116.00",
  oldPrice: "$200.00",
};

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function ProductDetailsPage({ params }: PageProps) {
  // Unwrap Next.js 15 dynamic route parameter promise using React.use
  const unwrappedParams = React.use ? React.use(params as Promise<{ id: string }>) : (params as { id: string });
  const id = unwrappedParams?.id;

  // Find product by id, default to fallbackProduct if "details" or not found
  const product = allProducts.find((p) => p.id === id) || fallbackProduct;

  // Image Switcher State
  const [mainImg, setMainImg] = useState<string>(product.imgDefault);
  const smallImages = [product.imgHover, product.imgDefault, product.imgHover];

  // Tab State
  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");

  // Selection States
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [qty, setQty] = useState<number>(3);

  // Review Form States
  const [rating, setRating] = useState<number>(5);

  const colors = [
    "hsl(37, 100%, 65%)",
    "hsl(353, 100%, 65%)",
    "hsl(49, 100%, 60%)",
    "hsl(304, 100%, 78%)",
    "hsl(126, 61%, 52%)",
  ];

  const sizes = ["M", "L", "XL", "XXL"];

  // Related products (filtering out the current product)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full">
      {/*=============== BREADCRUMB ===============*/}
      <section className="breadcrumb mb-6 py-4 px-4 sm:px-6 rounded-xl bg-gray-50 container">
        <ul className="breadcrumb__list flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="breadcrumb__link hover:text-emerald-700">
              Home
            </Link>
          </li>
          <li>&gt;</li>
          <li>
            <Link href="/Shop" className="breadcrumb__link hover:text-emerald-700">
              {product.category}
            </Link>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-emerald-800 break-words">{product.title}</li>
        </ul>
      </section>

      {/*=============== DETAILS ===============*/}
      <section className="details section--lg">
        <div className="details__container container grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left side: Images */}
          <div className="details__group">
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm p-4 bg-white flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
              <Image
                src={mainImg}
                alt={product.title}
                className="details__img object-contain w-full h-full transition-transform duration-500 hover:scale-105"
                width={600}
                height={600}
                priority
              />
            </div>
            <div className="details__small-images grid grid-cols-3 gap-4 mt-4">
              {smallImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImg(img)}
                  className={`cursor-pointer rounded-xl overflow-hidden border p-2 bg-white hover:shadow-md transition-all h-[80px] sm:h-[100px] md:h-[120px] flex items-center justify-center ${
                    mainImg === img ? "border-emerald-500 shadow-sm" : "border-gray-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    className="details__small-img object-contain w-full h-full"
                    width={150}
                    height={150}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Product Info */}
          <div className="details__group">
            <h3 className="details__title text-2xl md:text-3xl font-bold text-[#0c4f4a] mb-2 break-words">
              {product.title}
            </h3>
            <p className="details__brand text-gray-500 text-sm mb-4">
              Brand: <span className="font-semibold text-emerald-600">adidas</span>
            </p>
            <div className="details__price flex flex-wrap items-center gap-3 my-4 sm:my-6">
              <span className="new__price text-2xl sm:text-3xl font-bold text-emerald-600">
                {product.newPrice}
              </span>
              <span className="old__price text-lg text-gray-400 line-through">
                {product.oldPrice}
              </span>
              <span className="save__price text-xs bg-red-50 text-red-500 font-bold px-2.5 py-1 rounded-full border border-red-100">
                25% Off
              </span>
            </div>
            <p className="short__description text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptate, fuga. Quo blanditiis recusandae facere nobis cum optio,
              inventore aperiam placeat, quis maxime nam officiis illum? Optio
              et nisi eius, inventore impedit ratione sunt, cumque, eligendi
              asperiores iste porro non error?
            </p>
            
            <ul className="products__list space-y-3 mb-6 border-b border-gray-100 pb-6">
              <li className="list__item flex items-center gap-2 text-gray-600 text-sm font-medium">
                <i className="fi fi-rs-crown text-emerald-600 text-lg"></i> 1 Year Al Jazeera Brand Warranty
              </li>
              <li className="list__item flex items-center gap-2 text-gray-600 text-sm font-medium">
                <i className="fi fi-rs-refresh text-emerald-600 text-lg"></i> 30 Days Return Policy
              </li>
              <li className="list__item flex items-center gap-2 text-gray-600 text-sm font-medium">
                <i className="fi fi-rs-credit-card text-emerald-600 text-lg"></i> Cash on Delivery available
              </li>
            </ul>

            {/* Colors */}
            <div className="details__color flex flex-wrap items-center gap-4 my-4">
              <span className="details__color-title font-bold text-[#0c4f4a] text-sm">
                Color
              </span>
              <ul className="color__list flex flex-wrap gap-2">
                {colors.map((color, idx) => (
                  <li key={idx}>
                    <span
                      className="color__link w-6 h-6 rounded-full block border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    ></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes */}
            <div className="details__size flex flex-wrap items-center gap-4 my-6">
              <span className="details__size-title font-bold text-[#0c4f4a] text-sm">
                Size
              </span>
              <ul className="size__list flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <li key={sz}>
                    <button
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600"
                      }`}
                    >
                      {sz}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="details__action flex flex-wrap items-center gap-3 sm:gap-4 my-6">
              <input
                type="number"
                className="quantity border border-gray-200 rounded-xl px-3 py-2 w-20 text-center font-bold text-[#0c4f4a]"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button className="btn btn--sm !h-[45px] px-6 hover:scale-[1.02] active:scale-95 transition-all">
                Add To Cart
              </button>
              <button
                type="button"
                className="w-11 h-11 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Add to Wishlist"
              >
                <i className="fi fi-rs-heart text-lg"></i>
              </button>
            </div>

            {/* Meta Details */}
            <ul className="details__meta border-t border-gray-100 pt-6 space-y-2 text-sm text-gray-500">
              <li className="meta__list flex gap-2">
                <span className="font-semibold text-gray-400">SKU:</span>
                <span className="font-bold text-[#0c4f4a]">FWM15VKT</span>
              </li>
              <li className="meta__list flex gap-2">
                <span className="font-semibold text-gray-400">Tags:</span>
                <span className="font-bold text-[#0c4f4a]">Clothes, Women, Dress</span>
              </li>
              <li className="meta__list flex gap-2">
                <span className="font-semibold text-gray-400">Availability:</span>
                <span className="font-bold text-emerald-600">8 Items in Stock</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*=============== DETAILS TABS (INFO & REVIEWS) ===============*/}
      <section className="details__tab container mt-12">
        <div className="detail__tabs flex border-b border-gray-200 gap-4 sm:gap-8 mb-6 overflow-x-auto scrollbar-hide flex-nowrap whitespace-nowrap">
          <span
            onClick={() => setActiveTab("info")}
            className={`detail__tab pb-3 text-lg font-bold cursor-pointer transition-all border-b-2 ${
              activeTab === "info"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-400 hover:text-[#0c4f4a]"
            }`}
          >
            Additional Info
          </span>
          <span
            onClick={() => setActiveTab("reviews")}
            className={`detail__tab pb-3 text-lg font-bold cursor-pointer transition-all border-b-2 ${
              activeTab === "reviews"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-400 hover:text-[#0c4f4a]"
            }`}
          >
            Reviews (3)
          </span>
        </div>

        <div className="details__tabs-content bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-sm">
          {activeTab === "info" ? (
            <div className="details__tab-content active-tab" id="info">
              <div className="w-full">
                <table className="info__table w-full text-left border-collapse text-sm text-gray-600 block sm:table">
                  <tbody className="block sm:table-row-group">
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Stand Up</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">35&quot; L x 24&quot;W x 37-45&quot;H(front to back wheel)</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Folded (w/o wheels)</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">32.5&quot;L x 18.5&quot;W x 16.5&quot;H</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Folded (w/o wheels)</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">32.5&quot;L x 24&quot;W x 18.5&quot;H</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Door Pass Through</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">24</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Frame</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">Aluminum</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Weight (w/o wheels)</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">20 LBS</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Weight Capacity</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">60 LBS</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Width</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">24</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Handle Height (ground to handle)</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">37-45</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Wheels</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">12&quot; air / wide track slick tread</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Seat back height</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">21.5</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Head Room(inside canopy)</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">25&quot;</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Color</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">Black, Blue, Red, White</td>
                    </tr>
                    <tr className="border-b border-gray-100 block sm:table-row">
                      <th className="pt-3 sm:py-3 font-semibold text-[#0c4f4a] w-full sm:w-1/3 block sm:table-cell">Size</th>
                      <td className="pb-3 sm:py-3 block sm:table-cell break-words">M, S</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="details__tab-content" id="reviews">
              <div className="reviews__container grid grid-cols-1 gap-6 mb-8">
                {/* Review 1 */}
                <div className="review__single flex flex-col sm:flex-row gap-4 p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                  <div className="text-left sm:text-center flex-shrink-0 flex sm:block items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-gray-200 mx-auto bg-gray-100 flex items-center justify-center">
                      <Image
                        src="/img/avatar-1.jpg"
                        alt=""
                        className="review__img object-cover w-full h-full"
                        width={56}
                        height={56}
                      />
                    </div>
                    <h4 className="review__title text-xs font-bold text-[#0c4f4a] mt-2">
                      Jacky Chan
                    </h4>
                  </div>
                  <div className="review__data flex-1">
                    <div className="review__rating text-amber-400 text-xs flex gap-0.5 mb-2">
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                    </div>
                    <p className="review__description text-sm text-gray-600 leading-relaxed">
                      Thank you, very fast shipping from Poland only 3days.
                    </p>
                    <span className="review__date text-[10px] text-gray-400 mt-2 block">
                      December 4, 2022 at 3:12 pm
                    </span>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="review__single flex flex-col sm:flex-row gap-4 p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                  <div className="text-left sm:text-center flex-shrink-0 flex sm:block items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-gray-200 mx-auto bg-gray-100 flex items-center justify-center">
                      <Image
                        src="/img/avatar-2.jpg"
                        alt=""
                        className="review__img object-cover w-full h-full"
                        width={56}
                        height={56}
                      />
                    </div>
                    <h4 className="review__title text-xs font-bold text-[#0c4f4a] mt-2">
                      Meriem Js
                    </h4>
                  </div>
                  <div className="review__data flex-1">
                    <div className="review__rating text-amber-400 text-xs flex gap-0.5 mb-2">
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                    </div>
                    <p className="review__description text-sm text-gray-600 leading-relaxed">
                      Great low price and works well
                    </p>
                    <span className="review__date text-[10px] text-gray-400 mt-2 block">
                      August 23, 2022 at 19:45 pm
                    </span>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="review__single flex flex-col sm:flex-row gap-4 p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                  <div className="text-left sm:text-center flex-shrink-0 flex sm:block items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-gray-200 mx-auto bg-gray-100 flex items-center justify-center">
                      <Image
                        src="/img/avatar-3.jpg"
                        alt=""
                        className="review__img object-cover w-full h-full"
                        width={56}
                        height={56}
                      />
                    </div>
                    <h4 className="review__title text-xs font-bold text-[#0c4f4a] mt-2">
                      Moh Benz
                    </h4>
                  </div>
                  <div className="review__data flex-1">
                    <div className="review__rating text-amber-400 text-xs flex gap-0.5 mb-2">
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                      <i className="fi fi-rs-star"></i>
                    </div>
                    <p className="review__description text-sm text-gray-600 leading-relaxed">
                      Authentic and beautiful, Love these ways more than ever
                      expected, They are great earphones.
                    </p>
                    <span className="review__date text-[10px] text-gray-400 mt-2 block">
                      March 2, 2021 at 10:01 am
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Input Form */}
              <div className="review__form border-t border-gray-100 pt-6">
                <h4 className="review__form-title text-lg font-bold text-[#0c4f4a] mb-4">
                  Add a review
                </h4>
                <div className="rate__product flex gap-1 text-gray-300 text-lg mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fi fi-rs-star cursor-pointer transition-colors ${
                        rating >= star ? "text-amber-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    ></i>
                  ))}
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="form grid gap-4">
                  <textarea
                    className="form__input textarea border border-gray-200 rounded-xl p-4 text-sm text-gray-600 focus:border-emerald-500 h-32 w-full resize-none outline-none"
                    placeholder="Write Comment"
                  ></textarea>
                  <div className="form__group grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="form__input border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:border-emerald-500 outline-none w-full"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="form__input border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 focus:border-emerald-500 outline-none w-full"
                    />
                  </div>
                  <div className="form__btn mt-2">
                    <button type="submit" className="btn hover:scale-[1.02] active:scale-95 transition-all">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/*=============== RELATED PRODUCTS ===============*/}
      <section className="products container section--lg mt-12">
        <h3 className="section__title">
          <span>Related</span> Products
        </h3>
        <div className="products__container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((prod) => (
            <div key={prod.id} className="product__item group relative border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
              <div className="product__banner p-3 relative">
                <Link href={`/Shop/${prod.id}`} className="product__images block overflow-hidden rounded-2xl relative h-[280px]">
                  <Image
                    src={prod.imgDefault}
                    alt={prod.title}
                    className="product__img default w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={300}
                    height={370}
                  />
                  <Image
                    src={prod.imgHover}
                    alt={prod.title}
                    className="product__img hover w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    width={300}
                    height={370}
                  />
                </Link>
                <div className="product__actions absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Link href={`/Shop/${prod.id}`} className="action__btn w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#0c4f4a] hover:bg-[#def9ec] hover:text-emerald-700 transition-all">
                    <i className="fi fi-rs-eye"></i>
                  </Link>
                  <button type="button" className="action__btn w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#0c4f4a] hover:bg-[#def9ec] hover:text-emerald-700 transition-all">
                    <i className="fi fi-rs-heart"></i>
                  </button>
                  <button type="button" className="action__btn w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#0c4f4a] hover:bg-[#def9ec] hover:text-emerald-700 transition-all">
                    <i className="fi fi-rs-shuffle"></i>
                  </button>
                </div>
                {prod.badge && (
                  <div className={`product__badge absolute top-5 left-5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                    prod.badgeClass === "light-pink" ? "bg-pink-400" :
                    prod.badgeClass === "light-green" ? "bg-emerald-400" :
                    prod.badgeClass === "light-orange" ? "bg-amber-400" : "bg-sky-400"
                  }`}>
                    {prod.badge}
                  </div>
                )}
              </div>
              <div className="product__content p-4 pt-0">
                <span className="product__category text-xs text-gray-400">{prod.category}</span>
                <Link href={`/Shop/${prod.id}`}>
                  <h3 className="product__title font-semibold text-gray-800 hover:text-emerald-700 transition-colors my-1 text-sm truncate">
                    {prod.title}
                  </h3>
                </Link>
                <div className="product__rating text-amber-400 text-xs flex gap-0.5 mb-2">
                  {Array.from({ length: prod.rating }).map((_, rIdx) => (
                    <i key={rIdx} className="fi fi-rs-star"></i>
                  ))}
                </div>
                <div className="product__price flex items-center gap-2">
                  <span className="new__price font-bold text-emerald-600 text-sm">{prod.newPrice}</span>
                  <span className="old__price text-gray-400 line-through text-xs">{prod.oldPrice}</span>
                </div>
                <button type="button" className="action__btn cart__btn absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#def9ec] text-[#0c4f4a] flex items-center justify-center border border-[#c4f3dc] hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  <i className="fi fi-rs-shopping-bag-add"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*=============== NEWSLETTER ===============*/}
      <section className="newsletter section mt-12 bg-gray-50 rounded-3xl py-12">
        <div className="newsletter__container container grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="newsletter__title flex items-center font-bold text-gray-800 text-2xl gap-2">
              <Image
                src="/img/icon-email.svg"
                alt="email envelope icon"
                className="newsletter__icon w-8 h-8"
                width={32}
                height={32}
              />
              Sign up to Newsletter
            </h3>
            <p className="newsletter__description font-medium text-gray-500 mt-1">
              ...and receive $25 coupon for first shopping.
            </p>
          </div>
          <form
            className="newsletter__form flex w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter__input border border-gray-200 bg-white px-4 py-3 w-full rounded-l-2xl outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="newsletter__btn bg-[#0c4f4a] text-white font-semibold px-6 py-3 rounded-r-2xl hover:bg-emerald-700 transition-colors duration-300 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
