import React from "react";
import Image from "next/image";
import { showcaseGroups } from "./data";

export default function Showcase() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:mr-0 md:mr-0 mr-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {showcaseGroups.map((group, idx) => (
            <div 
              key={idx} 
              className={`
                flex flex-col 
                ${idx === 0 ? 'ml-0' : 'ml-4 sm:ml-0'}
                ${idx % 2 === 1 ? 'sm:ml-0' : ''}
              `}
            >
              {/* Group Title */}
              <h3 className="font-semibold text-lg md:text-lg lg:text-xl mb-4 md:mb-5 relative pb-2 md:pb-3 text-gray-800 lg:mr-0 md:mr-0 mr-20">
                {group.title}
                <span className="absolute bottom-[-1px] left-0 w-[100px] h-[2px] bg-emerald-500"></span>
              </h3>
              
              {/* Items List */}
              <div className="space-y-3 md:space-y-4 lg:mr-0 md:mr-0">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="group flex items-center gap-3 md:gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    {/* Image - Left Side */}
                    <div className="relative w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] overflow-hidden flex-shrink-0 bg-[#f4f4f4] rounded-sm">
                      <Image
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        width={80}
                        height={80}
                      />
                    </div>
                    
                    {/* Content - Right Side */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-700 text-xs md:text-sm hover:text-emerald-600 transition-colors line-clamp-2 leading-tight mb-1 ">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs md:text-sm lg:text-base text-emerald-600">
                          {item.price}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400 line-through">
                          $240.0
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}