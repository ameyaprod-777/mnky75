import { HeroSection } from "@/components/home/HeroSection";
import { ChichaGallery } from "@/components/home/ChichaGallery";
import { ConceptSection } from "@/components/home/ConceptSection";
import { MenuPreview } from "@/components/home/MenuPreview";
import { QuoteSection } from "@/components/home/QuoteSection";
import { ReservationCta } from "@/components/home/ReservationCta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ChichaGallery />
      <ConceptSection />
      <MenuPreview />
      <QuoteSection />
      <ReservationCta />
    </>
  );
}
