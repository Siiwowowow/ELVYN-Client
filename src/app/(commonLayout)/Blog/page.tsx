"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, Clock, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "10 Essential Summer Style Trends for 2026",
    excerpt: "Discover the must-have lightweight linen coordinates, crochet shirts, and vibrant pastel accents to stay fresh and trendy this sunny season.",
    image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
    date: "July 12, 2026",
    readTime: "5 min read",
    author: "Elena Rostova",
    category: "Style Guide"
  },
  {
    id: "b2",
    title: "How to Build a Sustainable Capsule Wardrobe",
    excerpt: "Quality over quantity. Learn how selecting high-grade organic fibers and classic silhouettes can reduce your environmental footprint without compromising style.",
    image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png",
    date: "July 08, 2026",
    readTime: "7 min read",
    author: "Marc Jacobs",
    category: "Eco-Fashion"
  },
  {
    id: "b3",
    title: "The Ultimate Guide to Denim Care & Longevity",
    excerpt: "Denim is meant to last. From washing temperatures to storage secrets, here is how you preserve the texture and dye of your favourite jeans for decades.",
    image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png",
    date: "June 28, 2026",
    readTime: "4 min read",
    author: "Sarah Connor",
    category: "Care Guide"
  }
];

export default function BlogPage() {
  return (
    <div className="space-y-8 w-full animate-fade-in">
      {/*=============== BREADCRUMBS ===============*/}
      <div className="breadcrumb py-4 px-6 rounded-xl bg-gray-50">
        <ul className="breadcrumb__list flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="breadcrumb__link hover:text-emerald-700">Home</Link></li>
          <li>&gt;</li>
          <li className="font-semibold text-emerald-800">Blog</li>
        </ul>
      </div>

      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
          <BookOpen size={14} />
          <span>Elvyn Stories</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight sm:text-4xl">
          Latest Stories & Style Guide
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Stay updated with local trends, wardrobe care tutorials, and exclusive capsule launches curated by our design studio.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id} 
            className="group flex flex-col bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            {/* Image banner */}
            <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            {/* Post info */}
            <div className="p-6 flex flex-col flex-1 space-y-3">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {post.title}
              </h2>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User size={13} className="text-emerald-600" />
                  <span className="font-semibold">{post.author}</span>
                </div>

                <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                  <span>Read Article</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
