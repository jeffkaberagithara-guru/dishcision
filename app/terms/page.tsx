import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-3xl space-y-6">
        <h1 className="font-serif text-4xl md:text-6xl text-[#171714] font-normal">
          Terms of Service
        </h1>
        <p className="text-sm md:text-base text-[#6E6A61] leading-relaxed">
          By using DISHCISION, you agree to these terms. DISHCISION is provided
          as a personal meal decision tool to assist with household meal
          choices.
        </p>
      </main>
      <Footer />
    </div>
  );
}
