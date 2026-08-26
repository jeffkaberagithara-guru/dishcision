import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="pt-4">
          <Link href="/">
            <Button variant="primary" size="hero">DECIDE NOW</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
