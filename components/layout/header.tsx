"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isPublic?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

const NAV = [
  { href: "/", label: "Decide" },
  { href: "/app/plan", label: "Plan" },
  { href: "/app/my-food", label: "My Food" },
  { href: "/app/shopping", label: "Shopping" },
  { href: "/app/settings", label: "Settings" },
];

export const Header: React.FC<HeaderProps> = ({ isPublic = false }) => {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-[#DCD5C9]/70 bg-[#F7F3EC]/85 backdrop-blur-md sticky top-0 z-40">
      <div className="container-editorial flex items-center justify-between h-16 md:h-[4.5rem]">
        <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 group">
          <span className="grid place-items-center size-9 md:size-10 rounded-xl bg-[#171714] text-[#F7F3EC] transition-transform group-hover:scale-105">
            <span className="font-serif text-lg md:text-xl font-semibold">D</span>
          </span>
          <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-[#171714]">
            DISHCISION
          </span>
        </Link>

        {!isPublic && (
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#6E6A61]">
            {NAV.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={scrollToTop}
                  className={cn(
                    "px-3.5 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#171714] text-[#F7F3EC]"
                      : "hover:text-[#171714] hover:bg-[#171714]/5",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {isPublic && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#6E6A61]">
            <Link href="/how-it-works" className="px-3.5 py-2 rounded-lg hover:text-[#171714] hover:bg-[#171714]/5 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="px-3.5 py-2 rounded-lg hover:text-[#171714] hover:bg-[#171714]/5 transition-colors">
              About
            </Link>
            <Link
              href="/"
              className="ml-2 px-5 py-2.5 bg-[#171714] text-[#F7F3EC] rounded-xl hover:bg-[#2A2925] transition-colors"
            >
              Enter App
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
