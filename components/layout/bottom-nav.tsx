"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, Utensils, ShoppingBag } from "lucide-react";
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
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F3EC] border-t border-[#DCD5C9] px-4 py-2 flex justify-around items-center">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={scrollToTop}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider font-sans py-1 px-3 rounded",
              isActive
                ? "text-[#171714] font-semibold"
                : "text-[#6E6A61] hover:text-[#171714]",
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
