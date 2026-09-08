"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, Utensils, ShoppingBag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
};

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Decide", icon: Sparkles },
    { href: "/app/plan", label: "Plan", icon: Calendar },
    { href: "/app/my-food", label: "My Food", icon: Utensils },
    { href: "/app/shopping", label: "Shopping", icon: ShoppingBag },
    { href: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-t border-[#DCD5C9] px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 flex items-stretch gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={scrollToTop}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-wide font-sans py-2 px-1 rounded-xl min-w-0",
              isActive
                ? "text-[#171714] bg-[#171714]/5 font-semibold"
                : "text-[#6E6A61] hover:text-[#171714]",
            )}
          >
            <Icon className="w-6 h-6 shrink-0" />
            <span className="truncate w-full text-center">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
