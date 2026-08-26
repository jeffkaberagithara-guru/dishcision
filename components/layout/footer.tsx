import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#DCD5C9] bg-[#F7F3EC] py-12 md:py-16">
      <div className="container-editorial flex flex-col md:flex-row items-center justify-between gap-8 text-xs font-sans text-[#6E6A61]">
        <div className="space-y-2 text-center md:text-left">
          <div className="font-serif text-xl tracking-tight text-[#171714]">
            DISHCISION
          </div>
          <p className="max-w-sm text-xs leading-relaxed">
            A personal food decision engine. Built with discipline for Kenyan
            kitchens and homes everywhere.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 uppercase tracking-widest text-[11px]">
          <Link
            href="/how-it-works"
            className="hover:text-[#171714] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="hover:text-[#171714] transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="hover:text-[#171714] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-[#171714] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#171714] transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="text-[11px] text-center md:text-right">
          © {new Date().getFullYear()} DISHCISION. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
