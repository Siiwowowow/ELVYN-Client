"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { popularProducts, Product } from "./data";

const PopularCategories: React.FC = () => {
  const popularRef = useRef<HTMLDivElement>(null);
  const [isPopularPaused, setIsPopularPaused] = useState(false);

  // Autoplay logic
  useEffect(() => {
    if (isPopularPaused) return;

    const autoplay = setInterval(() => {
      if (popularRef.current) {
        const container = popularRef.current;
        const firstCard = container.firstElementChild as HTMLElement;
        const cardWidth = firstCard ? firstCard.offsetWidth : 200;
        const gap = 16;
        const scrollAmount = cardWidth + gap;

        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(autoplay);
  }, [isPopularPaused]);

  // Initial loop positioning
  useEffect(() => {
    if (popularRef.current) {
      const container = popularRef.current;
      setTimeout(() => {
        const singleSetWidth = container.scrollWidth / 3;
        container.scrollLeft = singleSetWidth;
      }, 50);
    }
  }, []);

  // Infinite loop scroll listener & resize handling
  useEffect(() => {
    const container = popularRef.current;
    if (!container) return;

    const handleScroll = () => {
      const singleSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft <= 5) {
        container.scrollLeft = singleSetWidth + container.scrollLeft;
      } else if (container.scrollLeft >= singleSetWidth * 2 - 5) {
        container.scrollLeft = container.scrollLeft - singleSetWidth;
      }
    };

    const handleResize = () => {
      const singleSetWidth = container.scrollWidth / 3;
      // Re-adjust scroll offset to prevent slider getting stuck out of bounds
      if (container.scrollLeft < singleSetWidth || container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft = singleSetWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollPopularProducts = (direction: "left" | "right") => {
    if (popularRef.current) {
      const container = popularRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth : 200;
      const gap = 16;
      const scrollAmount = cardWidth + gap;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          .popular-products-section {
            font-family: "Geist", sans-serif;
          }
          .popular-products-section * {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <section className="bg-white flex items-center justify-center px-4 py-8 md:py-12 lg:py-16 overflow-hidden popular-products-section">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center gap-2 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-lg lg:ml-0 ml-22 lg:text-2xl md:text-3xl font-bold truncate">
              <span className="text-emerald-600">Popular</span> Products
            </h3>
            <div className="flex lg:mr-0 md:mr-0 mr-22 gap-2">
              <button
                type="button"
                onClick={() => scrollPopularProducts("left")}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#def9ec] text-[#0c4f4a] flex items-center justify-center border border-[#c4f3dc] hover:bg-[#c4f3dc] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollPopularProducts("right")}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#def9ec] text-[#0c4f4a] flex items-center justify-center border border-[#c4f3dc] hover:bg-[#c4f3dc] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div
              ref={popularRef}
              onMouseEnter={() => setIsPopularPaused(true)}
              onMouseLeave={() => setIsPopularPaused(false)}
              onTouchStart={() => setIsPopularPaused(true)}
              onTouchEnd={() => setIsPopularPaused(false)}
              className="flex overflow-x-auto py-2 scrollbar-hide snap-x snap-mandatory w-full items-stretch"
              style={{ gap: "16px" }}
            >
              {[...popularProducts, ...popularProducts, ...popularProducts].map(
                (prod: Product, idx: number) => (
                  <div
                    key={idx}
                    className="group shrink-0 snap-start flex flex-col h-full w-full sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] bg-white border-0 sm:border border-[#c4f3dc] rounded-xl hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300"
                  >
                    <div className="p-2 sm:p-3 relative flex-1 flex flex-col">
                      <Link
                        href={`/Shop/${prod.id}`}
                        className="relative block overflow-hidden rounded-lg bg-[#f4f4f4] aspect-square flex-1"
                      >
                        <Image
                          src={prod.imgDefault}
                          alt={prod.title}
                          className="w-full h-full object-contain p-2 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                          width={300}
                          height={300}
                        />
                        <Image
                          src={prod.imgHover}
                          alt={prod.title}
                          className="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
                          width={300}
                          height={300}
                        />
                      </Link>

                      {/* Action Buttons */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Link
                          href={`/Shop/${prod.id}`}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#def9ec] text-[#0c4f4a] rounded-full hover:bg-[#063c28] hover:text-white transition-all shadow-sm"
                          aria-label="Quick View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#def9ec] text-[#0c4f4a] rounded-full hover:bg-[#063c28] hover:text-white transition-all shadow-sm"
                          aria-label="Add to Wishlist"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#def9ec] text-[#0c4f4a] rounded-full hover:bg-[#063c28] hover:text-white transition-all shadow-sm"
                          aria-label="Compare"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                      </div>

                      {/* Badge */}
                      {prod.badge && (
                        <div
                          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-white text-[10px] sm:text-xs font-semibold z-10 ${
                            prod.badgeClass === "light-pink"
                              ? "bg-pink-400"
                              : prod.badgeClass === "light-green"
                              ? "bg-emerald-400"
                              : prod.badgeClass === "light-orange"
                              ? "bg-orange-400"
                              : "bg-blue-400"
                          }`}
                        >
                          {prod.badge}
                        </div>
                      )}
                    </div>

                    <div className="px-3 pb-3 sm:px-4 sm:pb-4 flex flex-col flex-1">
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {prod.category}
                      </span>
                      <Link href={`/Shop/${prod.id}`}>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-emerald-700 transition-colors line-clamp-2 my-1">
                          {prod.title}
                        </h3>
                      </Link>
                      <div className="flex text-yellow-400 text-[10px] sm:text-xs gap-0.5 mb-1 sm:mb-2">
                        {Array.from({ length: prod.rating }).map((_, rIdx) => (
                          <svg key={rIdx} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-600 font-bold text-sm sm:text-lg">
                            {prod.newPrice}
                          </span>
                          <span className="text-gray-400 text-[10px] sm:text-xs line-through">
                            {prod.oldPrice}
                          </span>
                        </div>
                        <button
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#def9ec] text-[#0c4f4a] hover:bg-[#c4f3dc] transition-colors flex-shrink-0"
                          aria-label="Add To Cart"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularCategories;