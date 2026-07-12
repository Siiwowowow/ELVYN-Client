"use client";

import React from "react";
import Image from "next/image";
import PopularCategories from "./PopularCategories";
import ProductsTabbed from "./ProductsTabbed";
import Deals from "./Deals";
import NewArrivals from "./NewArrivals";
import Showcase from "./Showcase";
import Newsletter from "./Newsletter";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/*=============== HOME HERO ===============*/}
      <section className="home section--lg py-6 sm:py-10 md:py-14 lg:py-20">
        <div className="home__container container grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="home__content text-center lg:text-left order-2 lg:order-1">
            <span className="home__subtitle inline-block text-lg  font-semibold text-emerald-600 mb-1 sm:mb-2 md:mb-3 lg:mb-4">
              Hot Promotions
            </span>
            <h1 className="home__title text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight">
              Fashion Trending <span className="block text-emerald-600">Great Collection</span>
            </h1>
            <p className="home__description text-sm sm:text-base md:text-lg text-gray-600 mt-2 sm:mt-3 md:mt-4 mb-3 sm:mb-4 md:mb-6">
              Save more with coupons & up to 20% off
            </p>
            <Link
              href="/shop"
              className="btn inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 text-xs sm:text-sm md:text-base font-semibold hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
          <div className="home__img-wrapper flex justify-center lg:justify-end order-1 lg:order-2">
            <Image
              src="/img/home-img.png"
              className="home__img animate-bounce-slow w-[150px] sm:w-[200px] md:w-[280px] lg:w-[450px] xl:w-[550px] 2xl:w-[650px] h-auto"
              alt="home fashion hats"
              width={700}
              height={550}
              priority
            />
          </div>
        </div>
      </section>

      {/*=============== POPULAR CATEGORIES ===============*/}
      <PopularCategories />

      {/*=============== PRODUCTS TABBED SECTION ===============*/}
      <ProductsTabbed />

      {/*=============== DEALS ===============*/}
      <Deals />

      {/*=============== NEW ARRIVALS ===============*/}
      <NewArrivals />

      {/*=============== SHOWCASE ===============*/}
      <Showcase />

      {/*=============== NEWSLETTER ===============*/}
      <Newsletter />
    </div>
  );
}