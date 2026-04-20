import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import DeliveryBanner from "@/components/landing/DeliveryBanner";
import Benefits from "@/components/landing/Benefits";
import Products from "@/components/landing/Products";
import Promotions from "@/components/landing/Promotions";
import Usage from "@/components/landing/Usage";
import Warnings from "@/components/landing/Warnings";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex flex-col bg-pearl min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <DeliveryBanner />
      <Benefits />
      <Products />
      <Promotions />
      <Usage />
      <Warnings />
      <CTA />
      <Footer />
    </main>
  );
}
