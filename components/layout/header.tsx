"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Utensils,
  Calendar,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isPublic?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

export const Header: React.FC<HeaderProps> = ({ isPublic = false }) => {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-[#DCD5C9] bg-[#F7F3EC]/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="container-editorial flex items-center justify-between h-16 md:h-20">
        <Link href="/" onClick={scrollToTop} className="flex items-center gap-2">
          <span className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-[#171714]">
            DISHCISION
          </span>
          <span className="text-[9px] uppercase tracking-widest font-sans px-1.5 py-0.5 bg-[#8A9B84]/20 text-[#54684E] rounded-[2px] font-semibold">
            KE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 md:gap-8 text-xs uppercase tracking-widest font-sans font-medium text-[#6E6A61]">
          {isPublic ? (
            <>
              <Link
                href="/how-it-works"
                className="hover:text-[#171714] transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="hover:text-[#171714] transition-colors hidden sm:inline-block"
              >
                About
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-[#171714] text-[#F7F3EC] rounded-[2px] hover:bg-[#2A2925] transition-colors text-xs font-sans tracking-widest uppercase"
              >
                Enter App
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={scrollToTop}
                className={cn(
                  "flex items-center gap-1.5 hover:text-[#171714] transition-colors",
                  pathname === "/" && "text-[#171714] font-semibold",
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Decide</span>
              </Link>
              <Link
                href="/app/plan"
                onClick={scrollToTop}
                className={cn(
                  "flex items-center gap-1.5 hover:text-[#171714] transition-colors",
                  pathname === "/app/plan" && "text-[#171714] font-semibold",
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Plan</span>
              </Link>
              <Link
                href="/app/my-food"
                onClick={scrollToTop}
                className={cn(
                  "flex items-center gap-1.5 hover:text-[#171714] transition-colors",
                  pathname === "/app/my-food" && "text-[#171714] font-semibold",
                )}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>My Food</span>
              </Link>
              <Link
                href="/app/shopping"
                onClick={scrollToTop}
                className={cn(
                  "flex items-center gap-1.5 hover:text-[#171714] transition-colors",
                  pathname === "/app/shopping" &&
                    "text-[#171714] font-semibold",
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopping</span>
              </Link>
              <Link
                href="/app/settings"
                onClick={scrollToTop}
                className={cn(
                  "flex items-center gap-1.5 hover:text-[#171714] transition-colors",
                  pathname === "/app/settings" &&
                    "text-[#171714] font-semibold",
                )}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
