"use client";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MdEmail, MdWhatsapp } from "react-icons/md";

export default function ContactUs() {
  //TO DO: add a in-built on-sided message system for users where they messages quries to admin and admin recieve theme in admin pannel.
  function handleSubmitMessage() {}

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">
            Contact Us
          </h1>
          <p className="text-sm md:text-base  text-center text-gray-600 mb-8">
            Interested in becoming a seller or simply want to learn more about
            our premium chicken? Get in touch with us!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            {/* <div className="bg-gray-100 p-6 rounded-lg  ">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                Get in Touch
              </h2>
              <form className="space-y-3" onSubmit={handleSubmitMessage}>
                <div>
                  <label
                    className="block text-xs text-gray-600 mb-1"
                    htmlFor="name"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-gray-600 mb-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-gray-600 mb-1"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="w-full border border-gray-300 p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-600"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-gray-600 mb-1"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    placeholder="How can we help you?"
                    className="w-full border border-gray-300 p-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-600 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white text-xs p-2 rounded hover:bg-orange-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div> */}

            {/* Contact Details */}
            <div className="bg-gray-100 p-6 rounded-lg text-sm md:text-base ">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <div className="mb-4">
                <p className="font-bold text-gray-700">Phone:</p>
                <p className="text-gray-600">+923039910747</p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-gray-700">Email:</p>
                <p className="text-gray-600">abdsab.pk@gmail.com</p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-gray-700">Office Address:</p>
                <p className="text-gray-600">
                  Shahdara,
                  <br /> Lahore, Pakistan
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/923039910747"
                  target="_blank"
                  className="flex items-center gap-2 text-orange-600 hover:underline"
                >
                  <MdWhatsapp size={14} />
                  WhatsApp Us
                </a>
                <a
                  href="mailto:admin@chickenshop.com"
                  className="flex items-center gap-2 text-orange-600 hover:underline"
                >
                  <MdEmail size={14} />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
