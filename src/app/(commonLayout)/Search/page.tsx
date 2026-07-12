/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="container section text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        We couldn't find any items matching your query. Please check your spelling or search for something else!
      </p>
      <div className="mt-8">
        <Link href="/Shop" className="btn btn--sm">
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
