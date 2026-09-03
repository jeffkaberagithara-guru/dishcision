import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-3xl space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">Privacy</span>
        <h1 className="font-hero text-4xl md:text-6xl text-[#171714]">Privacy Policy</h1>
        <p className="text-sm md:text-base text-[#6E6A61] leading-relaxed">
          At DISHCISION, we respect your privacy. Your food inventory, pantry
          lists, and meal logs are stored locally on your device or linked to
          your account securely.
        </p>
      </main>
      <Footer />
    </div>
  );
}
