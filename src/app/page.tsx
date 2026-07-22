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
import ScrollProgress from "@/components/landing/ScrollProgress";
import WhatsAppFab from "@/components/landing/WhatsAppFab";

export default function Home() {
  return (
    <main className="flex flex-col bg-[#f8f5f0] min-h-screen overflow-x-hidden selection:bg-gold/30 selection:text-navy">
      <ScrollProgress />
      <WhatsAppFab />
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
