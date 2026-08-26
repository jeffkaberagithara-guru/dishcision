'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Calendar, ShoppingBag } from 'lucide-react';

const DEMO_MEALS = [
  {
    name: 'MUKIMO + BEEF + CABBAGE',
    plate: [
      { role: 'STAPLE', name: 'Ndengu Mukimo' },
      { role: 'PROTEIN', name: 'Beef Stew' },
      { role: 'VEGETABLE', name: 'Fried Cabbage' },
    ],
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'UGALI + NYAMA CHOMA + KACHUMBARI',
    plate: [
      { role: 'STAPLE', name: 'Ugali' },
      { role: 'PROTEIN', name: 'Nyama Choma' },
      { role: 'SALAD', name: 'Kachumbari' },
    ],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'RICE + BEANS + SUKUMA WIKI',
    plate: [
      { role: 'STAPLE', name: 'Rice' },
      { role: 'LEGUME', name: 'Beans Curry' },
      { role: 'VEGETABLE', name: 'Sukuma Wiki' },
    ],
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'PEAS GITHERI + AVOCADO + CABBAGE',
    plate: [
      { role: 'STAPLE', name: 'Peas Githeri' },
      { role: 'FRUIT', name: 'Avocado' },
      { role: 'VEGETABLE', name: 'Steamed Cabbage' },
    ],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function LandingPage() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleNextDemo = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setDemoIndex((prev) => (prev + 1) % DEMO_MEALS.length);
      setIsSpinning(false);
    }, 600);
  };

  const activeDemo = DEMO_MEALS[demoIndex];

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between selection:bg-[#8A9B84] selection:text-white">
      <Header isPublic />

      <main className="space-y-24 md:space-y-36 pb-24">
        {/* 1. HERO SECTION */}
        <section className="container-editorial pt-16 md:pt-28 space-y-12">
          <div className="max-w-4xl space-y-8">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#171714] leading-[0.98]">
              YOU HAVE FOOD. <br />
              YOU JUST DON&apos;T KNOW <br />
              <span className="italic font-normal">WHAT TO COOK.</span>
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl text-[#6E6A61] max-w-xl">
              Let DISHCISION decide.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/app/today">
                <Button variant="primary" size="hero" className="w-full sm:w-auto gap-3">
                  <Sparkles className="w-4 h-4 text-[#8A9B84]" />
                  MAKE MY DISHCISION
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="hero" className="w-full sm:w-auto">
                  HOW IT WORKS
                </Button>
              </Link>
            </div>
          </div>

          {/* 4-Image Editorial Food Grid (Real Staples) */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-2 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#EDE7DE] border border-[#DCD5C9]">
                <Image
                  src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop"
                  alt="Ugali and stew"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#171714] block">
                UGALI
              </span>
            </div>

            <div className="space-y-2 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#EDE7DE] border border-[#DCD5C9]">
                <Image
                  src="https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop"
                  alt="Rice and beans"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#171714] block">
                RICE
              </span>
            </div>

            <div className="space-y-2 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#EDE7DE] border border-[#DCD5C9]">
                <Image
                  src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop"
                  alt="Mukimo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#171714] block">
                MUKIMO
              </span>
            </div>

            <div className="space-y-2 group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#EDE7DE] border border-[#DCD5C9]">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
                  alt="Githeri"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#171714] block">
                GITHERI
              </span>
            </div>
          </div>
        </section>

        {/* 2. THE THREE-STEP VALUE PROPOSITION */}
        <section className="container-editorial border-t border-[#DCD5C9] pt-20 space-y-16">
          <div className="max-w-2xl space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#171714] leading-tight">
              YOU BRING THE FOOD. <br />
              WE MAKE THE DECISION.
            </h2>
            <p className="text-sm md:text-base text-[#6E6A61] font-sans leading-relaxed">
              DISHCISION never introduces unfamiliar ingredients or unapproachable international recipes. The user owns their food universe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
              <span className="font-serif text-2xl md:text-3xl text-[#8A9B84] font-medium">01</span>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#171714]">
                ADD YOUR FOOD
              </h3>
              <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
                Enter the home meals and staples you already know how to cook. Your pantry catalogue is the only menu DISHCISION pulls from.
              </p>
            </div>

            <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
              <span className="font-serif text-2xl md:text-3xl text-[#8A9B84] font-medium">02</span>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#171714]">
                TELL US WHAT&apos;S IN THE HOUSE
              </h3>
              <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
                Filter by current pantry availability or let the algorithm choose from your staples while preventing recent dinner repetition.
              </p>
            </div>

            <div className="space-y-4 border-l border-[#DCD5C9] pl-6">
              <span className="font-serif text-2xl md:text-3xl text-[#8A9B84] font-medium">03</span>
              <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#171714]">
                GET YOUR DISHCISION
              </h3>
              <p className="text-xs md:text-sm text-[#6E6A61] leading-relaxed">
                Receive an authoritative, balanced plate recommendation in under one second. Cook it, save it, or request another instant option.
              </p>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE HOME DEMONSTRATION */}
        <section className="container-editorial border-t border-[#DCD5C9] pt-20 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#8A9B84]">
                LIVE INTERACTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171714]">
                TODAY&apos;S DISHCISION
              </h2>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={handleNextDemo}
              isLoading={isSpinning}
              className="gap-2 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              DISHCISION AGAIN
            </Button>
          </div>

          <div className="border border-[#DCD5C9] bg-white p-8 md:p-12 rounded-[2px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#6E6A61] font-sans block">
                MAIN DINNER CANDIDATE
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#171714] font-normal leading-tight">
                {activeDemo.name}
              </h3>

              <div className="space-y-3 pt-4 border-t border-[#DCD5C9]/60">
                <span className="text-[10px] uppercase tracking-widest text-[#171714] font-semibold block">
                  THE PLATE
                </span>
                <div className="grid grid-cols-3 gap-4">
                  {activeDemo.plate.map((p, i) => (
                    <div key={i} className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-[#6E6A61] block">
                        {p.role}
                      </span>
                      <span className="font-serif text-base text-[#171714] font-medium block">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link href="/app/today">
                  <Button variant="primary" size="md">
                    ENTER APP & COOK THIS
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[#DCD5C9] bg-[#EDE7DE]">
                <Image
                  src={activeDemo.image}
                  alt={activeDemo.name}
                  fill
                  className="object-cover transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHOLE-DAY PLANNER SHOWCASE */}
        <section className="container-editorial border-t border-[#DCD5C9] pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#171714] leading-tight">
              ONE DAY. <br />
              THREE DECISIONS.
            </h2>
            <p className="text-sm md:text-base text-[#6E6A61] font-sans leading-relaxed">
              DISHCISION doesn&apos;t merely solve dinner. It connects Breakfast, Lunch, and Dinner into a seamless 24-hour cadence—intelligently turning yesterday&apos;s dinner into morning breakfast candidates to eliminate household food waste.
            </p>
            <Link href="/app/plan" className="inline-block pt-2">
              <Button variant="secondary" size="lg" className="gap-2">
                <Calendar className="w-4 h-4" />
                EXPLORE WHOLE-DAY PLAN
              </Button>
            </Link>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-white border border-[#DCD5C9] rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8A9B84] font-semibold">
                  01 · BREAKFAST
                </span>
                <h4 className="font-serif text-xl text-[#171714] font-medium">
                  Leftover Rice + Beef + Kenyan Spiced Tea
                </h4>
              </div>
              <Badge variant="terracotta">LEFTOVER</Badge>
            </div>

            <div className="p-6 bg-white border border-[#DCD5C9] rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8A9B84] font-semibold">
                  02 · LUNCH
                </span>
                <h4 className="font-serif text-xl text-[#171714] font-medium">
                  Peas Githeri + Sliced Avocado + Cabbage
                </h4>
              </div>
              <Badge variant="sage">BALANCED</Badge>
            </div>

            <div className="p-6 bg-white border border-[#DCD5C9] rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8A9B84] font-semibold">
                  03 · DINNER
                </span>
                <h4 className="font-serif text-xl text-[#171714] font-medium">
                  Ugali + Pork + Sukuma Wiki + Kachumbari
                </h4>
              </div>
              <Badge variant="sage">MAIN DISHCISION</Badge>
            </div>
          </div>
        </section>

        {/* 5. SHOPPING SHOWCASE */}
        <section className="container-editorial border-t border-[#DCD5C9] pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 p-8 bg-white border border-[#DCD5C9] rounded-[2px] space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#171714] border-b border-[#DCD5C9]/60 pb-3">
              NEXT MONTH&apos;S SHOPPING (AGGREGATED GOODS ONLY)
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6A61] font-semibold">
                  STAPLES
                </span>
                <p className="text-[#171714]">Maize flour, Rice, Potatoes, Bread</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6A61] font-semibold">
                  PROTEINS
                </span>
                <p className="text-[#171714]">Beef, Eggs, Pork, Sausages</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6A61] font-semibold">
                  VEGETABLES
                </span>
                <p className="text-[#171714]">Sukuma wiki, Cabbage, Spinach, Onions</p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6A61] font-semibold">
                  LEGUMES
                </span>
                <p className="text-[#171714]">Ndengu, Yellow Beans, Peas</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#171714] leading-tight">
              LESS THINKING. <br />
              LESS WASTE. <br />
              BETTER SHOPPING.
            </h2>
            <p className="text-sm md:text-base text-[#6E6A61] font-sans leading-relaxed">
              Your planned meals automatically turn into your monthly shopping list. No fake gram calculations—just genuine pantry items you actually need.
            </p>
            <Link href="/app/shopping" className="inline-block pt-2">
              <Button variant="secondary" size="lg" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                VIEW SHOPPING LIST
              </Button>
            </Link>
          </div>
        </section>

        {/* 6. FINAL EDITORIAL CTA */}
        <section className="container-editorial border-t border-[#DCD5C9] pt-24 pb-12 text-center max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#171714] font-normal leading-[0.98]">
            WHAT ARE WE <br />
            <span className="italic font-normal">EATING TOMORROW?</span>
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-[#6E6A61]">
            DISH·CISION ends daily cooking paralysis.
          </p>

          <div className="pt-4">
            <Link href="/app/today">
              <Button variant="primary" size="hero">
                START DECIDING LESS
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
