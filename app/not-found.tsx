import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial flex-1 flex flex-col items-center justify-center py-16 md:py-24 text-center max-w-2xl mx-auto space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-semibold text-[#B76546]">
          ERROR 404
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#171714] font-normal leading-[0.98]">
          THIS DISH <br />
          <span className="italic">DOESN&apos;T EXIST.</span>
        </h1>
        <p className="font-serif italic text-lg text-[#6E6A61] max-w-md">
          We couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back to deciding what to eat.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/app/today"
            className="inline-flex items-center justify-center font-sans font-medium rounded-[2px] transition-all duration-200 text-xs md:text-sm uppercase tracking-widest px-8 py-4 min-h-[52px] bg-[#171714] text-[#F7F3EC] hover:bg-[#2A2925] active:bg-[#11110F] border border-transparent shadow-sm"
          >
            BACK TO TODAY
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center font-sans font-medium rounded-[2px] transition-all duration-200 text-xs uppercase tracking-widest px-6 py-3 min-h-[46px] bg-transparent border border-[#171714] text-[#171714] hover:bg-[#171714]/5 active:bg-[#171714]/10"
          >
            RETURN HOME
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
