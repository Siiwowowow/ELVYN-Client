/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Newsletter() {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2 2 13M2 2l11 11"
              stroke="#1F2937"
              strokeOpacity=".7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="md:grid md:grid-cols-2">
          {/* Image Section - Left Side */}
          <div className="relative hidden md:block bg-linear-to-br from-[#b3d7d4] to-[#8fc5c1] p-8">
            <div className="relative h-full flex items-center justify-center">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/newsletter/image.png"
                alt="Newsletter"
                className="w-full max-w-md rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              {/* Decorative Badge */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg rotate-12">
                🎉 25% OFF
              </div>
              {/* Floating Decorations */}
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Content Section - Right Side */}
          <div className="flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="w-full max-w-md text-center md:text-left">
              {/* Email Icon */}
              <div className="flex justify-center md:justify-start mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-emerald-100 p-3 rounded-full">
                    <Image
                      src="/img/icon-email.svg"
                      alt="Email envelope icon"
                      width={40}
                      height={40}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Subscribe to our <br className="hidden sm:block" />
                <span className="text-emerald-600">Newsletter</span>
              </h2>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600">
                Be the first to get the latest news about trends, promotions, and much more!
              </p>

              {/* Coupon Highlight */}
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <span className="text-yellow-600 text-lg">🎁</span>
                <span className="text-sm font-semibold text-gray-700">
                  Get <span className="text-emerald-600">$25 coupon</span> for first shopping
                </span>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col sm:flex-row w-full gap-2 sm:gap-0"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  className="flex-1 outline-none rounded-xl sm:rounded-r-none border-2 border-gray-200 focus:border-emerald-500 px-4 py-3 text-gray-900 transition-colors duration-300 text-sm bg-white"
                />
                <button
                  type="submit"
                  className="relative overflow-hidden group rounded-xl sm:rounded-l-none bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 px-6 py-3 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 text-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Subscribe
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </form>

              {/* Trust Message */}
              <p className="mt-3 text-xs text-gray-500 flex items-center justify-center md:justify-start gap-1">
                <span>🔒</span>
                No spam, unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}