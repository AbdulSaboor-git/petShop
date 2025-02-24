"use client";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4">
            About Us
          </h1>
          <p className="text-sm md:text-base text-center text-gray-600 mb-8">
            We are dedicated to connecting quality chicken producers with
            discerning customers. Discover our story, mission, and why our
            platform is the perfect choice for selling and buying premium
            poultry.
          </p>
          <div className="space-y-6">
            {/* Our Story Section */}
            <section>
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Our Story
              </h2>
              <p className="text-sm md:text-base  text-gray-700 leading-relaxed">
                Founded with a passion for quality and sustainability, our
                platform was created to bring the finest chickens and related
                products directly from trusted local farmers to your table. Our
                journey started with a simple idea – to make premium poultry
                accessible, transparent, and reliable.
              </p>
            </section>
            {/* Our Mission Section */}
            <section>
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Our Mission
              </h2>
              <p className="text-sm md:text-base  text-gray-700 leading-relaxed">
                Our mission is to empower poultry sellers and provide customers
                with the highest quality products. We strive to build a
                trustworthy marketplace where ethical farming meets modern
                convenience.
              </p>
            </section>
            {/* Why Choose Us Section */}
            <section>
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Why Choose Us?
              </h2>
              <ul className="list-disc list-inside text-sm md:text-base  text-gray-700 space-y-1">
                <li>Premium quality chickens from trusted local farmers</li>
                <li>User-friendly platform for seamless transactions</li>
                <li>Transparent sourcing and ethical farming practices</li>
                <li>Outstanding customer service and support</li>
              </ul>
            </section>
            {/* Contact Information Section */}
            <section className="text-sm md:text-base ">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Contact Information
              </h2>
              <p className="text-sm md:text-base  text-gray-700 leading-relaxed">
                Want to know more about becoming a seller or have any questions?
                Reach out to us via WhatsApp or Email. Our office is located at:
              </p>
              <div className="mt-2">
                <p className="font-bold text-gray-700">Office Address:</p>
                <p className="text-gray-600">
                  Shahdara,
                  <br /> Lahore, Pakistan
                </p>
              </div>
              <div className="mt-2">
                <p className="font-bold text-gray-700">Phone:</p>
                <p className="text-gray-600">+923039910747</p>
              </div>
              <div className="mt-2">
                <p className="font-bold text-gray-700">Email:</p>
                <p className="text-gray-600">abdsab.pk@gmail.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
