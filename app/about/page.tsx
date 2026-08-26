import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-6xl text-[#171714] mb-8 font-normal">
          About DISHCISION
        </h1>
        <div className="space-y-6 text-sm md:text-base text-[#6E6A61] leading-relaxed">
          <p>
            DISHCISION is a personal food decision engine built to eliminate
            kitchen decision fatigue. Instead of suggesting obscure recipes or
            complicated ingredient lists, DISHCISION works strictly from your
            own food inventory.
          </p>
          <p>
            Designed with discipline for Kenyan kitchens and homes everywhere,
            DISHCISION ensures balance, variety, and leftover utilization in
            every daily cycle.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
