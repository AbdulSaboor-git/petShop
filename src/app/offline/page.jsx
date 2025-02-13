"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="max-w-[1400px] w-full">
        <Header />
        <div className="min-h-screen">Offline</div>
        <Footer />
      </div>
    </div>
  );
}
