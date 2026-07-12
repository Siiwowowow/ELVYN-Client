import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-6 sm:mt-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-6 lg:gap-8 xl:gap-12 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 text-left">
        
        {/* Col 1 - Brand & Contact */}
        <div className="space-y-3 sm:space-y-4">
          <Link href="/" className="inline-block">
            <Image
              src="/img/logo.svg"
              alt="Elvyn logo"
              className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
              width={160}
              height={48}
              priority
            />
          </Link>
          
          <div>
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base md:text-lg">
              Contact
            </h4>
            <div className="mt-2 space-y-1.5">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold">Address: </span> 
                562 Wellington Road, Street 32, San Francisco
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold">Phone: </span> 
                (+01) - 2345 - 6789 / (+91) 0123 456 789
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold">Hours: </span> 
                10:00 - 18:00, Mon - Sat
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 text-sm sm:text-base">
              Follow Me
            </h4>
            <div className="flex gap-2 sm:gap-3 mt-2 flex-wrap">
              <a 
                href="#facebook" 
                className="hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Image
                  src="/img/icon-facebook.svg"
                  alt="Facebook"
                  className="w-5 sm:w-6 md:w-7 opacity-80 hover:opacity-100 transition-opacity"
                  width={28}
                  height={28}
                />
              </a>
              <a 
                href="#twitter" 
                className="hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <Image
                  src="/img/icon-twitter.svg"
                  alt="Twitter"
                  className="w-5 sm:w-6 md:w-7 opacity-80 hover:opacity-100 transition-opacity"
                  width={28}
                  height={28}
                />
              </a>
              <a 
                href="#instagram" 
                className="hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <Image
                  src="/img/icon-instagram.svg"
                  alt="Instagram"
                  className="w-5 sm:w-6 md:w-7 opacity-80 hover:opacity-100 transition-opacity"
                  width={28}
                  height={28}
                />
              </a>
              <a 
                href="#pinterest" 
                className="hover:opacity-80 transition-opacity"
                aria-label="Pinterest"
              >
                <Image
                  src="/img/icon-pinterest.svg"
                  alt="Pinterest"
                  className="w-5 sm:w-6 md:w-7 opacity-80 hover:opacity-100 transition-opacity"
                  width={28}
                  height={28}
                />
              </a>
              <a 
                href="#youtube" 
                className="hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <Image
                  src="/img/icon-youtube.svg"
                  alt="YouTube"
                  className="w-5 sm:w-6 md:w-7 opacity-80 hover:opacity-100 transition-opacity"
                  width={28}
                  height={28}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Col 2 - Information */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            Information
          </h3>
          <ul className="space-y-2 sm:space-y-2.5">
            <li>
              <a 
                href="#about" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                About Us
              </a>
            </li>
            <li>
              <a 
                href="#delivery" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Delivery Information
              </a>
            </li>
            <li>
              <a 
                href="#privacy" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="#terms" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a 
                href="#support" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Support Center
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 - My Account */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            My Account
          </h3>
          <ul className="space-y-2 sm:space-y-2.5">
            <li>
              <a 
                href="#signin" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Sign In
              </a>
            </li>
            <li>
              <a 
                href="#cart" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                View Cart
              </a>
            </li>
            <li>
              <a 
                href="#wishlist" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                My Wishlist
              </a>
            </li>
            <li>
              <a 
                href="#track" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Track My Order
              </a>
            </li>
            <li>
              <a 
                href="#ticket" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Help Ticket
              </a>
            </li>
            <li>
              <a 
                href="#shipping" 
                className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                Shipping Details
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4 - Payment Gateways */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            Secured Payment Gateways
          </h3>
          <div className="mt-2">
            <Image
              src="/img/payment-method.png"
              alt="Accepted credit cards and payment gateways"
              className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] h-auto"
              width={260}
              height={40}
              priority
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 hidden sm:block">
            <i className="fi fi-rs-lock mr-1"></i>
            Secure Checkout
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Elvyn Cloth. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-xs sm:text-sm text-gray-500">Privacy Policy</span>
              <span className="w-px h-4 bg-gray-300"></span>
              <span className="text-xs sm:text-sm text-gray-500">Terms of Service</span>
              <span className="w-px h-4 bg-gray-300 hidden sm:block"></span>
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">Cookies</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              Designed with <span className="text-red-500">♥</span> by Antigravity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}