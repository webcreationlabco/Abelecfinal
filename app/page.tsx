import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import TrustPillars from "@/components/trust-pillars";
import CategoriesSection from "@/components/categories-section";
import ExpertsSection from "@/components/experts-section";
import ShippingSection from "@/components/shipping-section";
import ProductsSection from "@/components/products-section";
import TimelineSection from "@/components/timeline-section";
import TrustSection from "@/components/trust-section";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustPillars />
        <CategoriesSection />
        <ExpertsSection />
        <ShippingSection />
        <ProductsSection />
        <TimelineSection />
        <TrustSection />
      </main>
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
