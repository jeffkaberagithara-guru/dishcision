import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
      <Header isPublic />
      <main className="container-editorial flex-1 flex flex-col items-center justify-center py-16 md:py-24 text-center max-w-2xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B76546] px-3 py-1.5 bg-[#B76546]/10 rounded-full">
          Error 404
        </span>
        <h1 className="font-hero text-5xl sm:text-6xl md:text-7xl text-[#171714] leading-[0.98]">
          THIS DISH <br />
          <span className="italic text-[#8A9B84]">DOESN&apos;T EXIST.</span>
        </h1>
        <p className="font-serif italic text-xl text-[#6E6A61] max-w-md">
          We couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back to deciding what to eat.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button variant="primary" size="hero">Decide Now</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
