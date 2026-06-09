import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { GalerieApercu } from "@/components/sections/GalerieApercu";
import { Temoignages } from "@/components/sections/Temoignages";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <GalerieApercu />
      <Temoignages />
      <CTABanner />
    </>
  );
}
