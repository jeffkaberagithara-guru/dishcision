import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-4xl space-y-12">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl text-[#171714] font-normal">
            How DISHCISION Works
          </h1>
          <p className="font-serif italic text-xl text-[#6E6A61]">
            Three steps from decision paralysis to cooking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#DCD5C9]">
          <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
            <span className="font-serif text-3xl text-[#8A9B84]">01</span>
            <h3 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#171714]">
              Build Your Food Library
            </h3>
            <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
              Add your household meals and pantry staples once.
            </p>
          </div>

          <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
            <span className="font-serif text-3xl text-[#8A9B84]">02</span>
            <h3 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#171714]">
              Specify Today&apos;s Stock
            </h3>
            <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
              Quickly tap items in stock or let the engine pick from your core
              staples.
            </p>
          </div>

          <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
            <span className="font-serif text-3xl text-[#8A9B84]">03</span>
            <h3 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#171714]">
              Instant Dishcision
            </h3>
            <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
              Receive a definitive plate recommendation without endless recipe
              scrolling.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button variant="primary" size="hero">
              Get Started Now
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
