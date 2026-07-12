"use client";

import React, { Suspense } from "react";
import HomePage from "./Home/page";
import { GoogleLoginSuccess } from "@/components/GoogleLoginSuccess";

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <GoogleLoginSuccess />
      </Suspense>
      <HomePage />
    </>
  );
}
