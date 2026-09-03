import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block w-full border-t border-[#DCD5C9]/70 bg-[#F7F3EC] py-10">
      <div className="container-editorial flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans text-[#6E6A61]">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center size-7 rounded-lg bg-[#171714] text-[#F7F3EC]">
            <span className="font-serif font-semibold">D</span>
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#171714]">
            DISHCISION
          </span>
          <span className="text-[11px] text-[#8A9B84] ml-1">
            You have food. We make the decision.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 uppercase tracking-wide text-[11px]">
          <Link href="/how-it-works" className="hover:text-[#171714] transition-colors">How It Works</Link>
          <Link href="/about" className="hover:text-[#171714] transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-[#171714] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#171714] transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-[#171714] transition-colors">Contact</Link>
        </div>

        <div className="text-[11px] text-center md:text-right">
          © {new Date().getFullYear()} DISHCISION. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
