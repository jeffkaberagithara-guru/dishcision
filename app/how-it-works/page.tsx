import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const STEPS = [
  { num: "01", title: "Build Your Food Library", desc: "Add your household meals and pantry staples once." },
  { num: "02", title: "Specify Today's Stock", desc: "Quickly tap which items are available, or let the engine pick from your core staples." },
  { num: "03", title: "Instant Dishcision", desc: "Receive a definitive plate recommendation without endless recipe scrolling." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial py-16 md:py-24 max-w-4xl space-y-12">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8A9B84] block">How it works</span>
          <h1 className="font-hero text-4xl md:text-6xl text-[#171714]">
            How <span className="italic text-[#8A9B84]">DISHCISION</span> Works
          </h1>
          <p className="font-serif italic text-xl text-[#6E6A61]">
            Three steps from decision paralysis to cooking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-[#DCD5C9]">
          {STEPS.map((s) => (
            <div key={s.num} className="card-modern p-6 space-y-4">
              <span className="font-hero text-4xl text-[#8A9B84]">{s.num}</span>
              <h3 className="font-serif text-xl font-semibold text-[#171714]">{s.title}</h3>
              <p className="text-sm text-[#6E6A61] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button variant="primary" size="hero">Get Started Now</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
