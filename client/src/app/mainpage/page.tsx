"use client";
import HeroSection from "./Section/HeroSection"
import ServiceSection from "./Section/ServiceSection"
import BookingSection from "./Section/BookingSection"
import ProductSection from "./Section/ProductSection"
import AboutSection from "./Section/AboutSection"
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
export default function MainPage() {
    const bookingRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  useEffect(() => {
    if (searchParams.get("action") === "booking") {
      setTimeout(() => {
        scrollToBooking();
      }, 100);
    }
  }, [searchParams]);
  return (
    <main
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/imgs/bg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 space-y-0">
        <div className="animate-fade-in">
          <HeroSection onBookingClick= {scrollToBooking} />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <ServiceSection />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <BookingSection ref={bookingRef} />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <ProductSection />
        </div>
        <div className="animate-slide-up" style={{animationDelay: '0.8s'}}>
          <AboutSection />
        </div>
      </div>
    </main>
  )
}