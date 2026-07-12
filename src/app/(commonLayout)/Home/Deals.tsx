"use client";

import React, { useState, useEffect } from "react";

export default function Deals() {
  // --- Countdown Timer Logic ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 8);

    const interval = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="deals section py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="deals__container container grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {/* Deal 1 */}
        <div className="deals__item rounded-2xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px] xl:min-h-[350px] p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 bg-cover bg-center max-w-md mx-auto w-full" style={{backgroundImage: "url(/img/deals-1.jpg)"}}>
          <div className="z-10 bg-white/80 backdrop-blur-sm p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 rounded-xl max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] xl:max-w-xs 2xl:max-w-sm">
            <span className="deals__brand text-emerald-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl block">Deal of the Day</span>
            <h4 className="deals__category text-gray-500 font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm">Limited Quantities</h4>
            <h3 className="deals__title font-bold text-gray-800 mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg leading-tight">
              Trendy Designs & Pattern Shirts
            </h3>
            <div className="deals__price flex items-center gap-1 sm:gap-1.5 md:gap-2 my-0.5 sm:my-1 md:my-1.5 lg:my-2">
              <span className="old__price text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm line-through">$200.00</span>
              <span className="new__price font-bold text-red-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">$139.00</span>
            </div>
            <div className="deals__group">
              <p className="deal__countdown-text text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-semibold text-gray-700">
                Hurry Up! Offer Ends In:
              </p>
              <div className="countdown flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2">
                <div className="countdown__amount text-center">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.days}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Days</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.hours}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Hours</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.mins}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Mins</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.secs}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Secs</span>
                </div>
              </div>
            </div>
            <div className="deals__btn mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 xl:mt-4">
              <a href="#shop" className="btn btn--sm inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-0.5 sm:py-1 md:py-1.5 lg:py-2 rounded-lg transition-all duration-300 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm">
                Shop Now
              </a>
            </div>
          </div>
        </div>

        {/* Deal 2 */}
        <div className="deals__item rounded-2xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px] xl:min-h-[350px] p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 bg-cover bg-center max-w-md mx-auto w-full" style={{backgroundImage: "url(/img/deals-2.png)"}}>
          <div className="z-10 bg-white/80 backdrop-blur-sm p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 rounded-xl max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] xl:max-w-xs 2xl:max-w-sm">
            <span className="deals__brand text-emerald-600 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl block">Women Fashion</span>
            <h4 className="deals__category text-gray-500 font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm">Special Promotion</h4>
            <h3 className="deals__title font-bold text-gray-800 mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg leading-tight">
              Active & Summer Collection
            </h3>
            <div className="deals__price flex items-center gap-1 sm:gap-1.5 md:gap-2 my-0.5 sm:my-1 md:my-1.5 lg:my-2">
              <span className="old__price text-gray-400 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm line-through">$180.00</span>
              <span className="new__price font-bold text-red-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">$119.00</span>
            </div>
            <div className="deals__group">
              <p className="deal__countdown-text text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-semibold text-gray-700">
                Hurry Up! Offer Ends In:
              </p>
              <div className="countdown flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2">
                <div className="countdown__amount text-center">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.days}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Days</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.hours}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Hours</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.mins}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Mins</span>
                </div>
                <div className="countdown__amount text-center relative">
                  <div className="countdown__period bg-emerald-600 text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-lg text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold">{timeLeft.secs}</div>
                  <span className="unit text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-xs text-gray-600 block mt-0.5 sm:mt-1">Secs</span>
                </div>
              </div>
            </div>
            <div className="deals__btn mt-1.5 sm:mt-2 md:mt-2.5 lg:mt-3 xl:mt-4">
              <a href="#shop" className="btn btn--sm inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-0.5 sm:py-1 md:py-1.5 lg:py-2 rounded-lg transition-all duration-300 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
