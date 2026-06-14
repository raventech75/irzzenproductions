import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisponibiliteBanner } from "@/components/ui/DisponibiliteBanner";
import { BackToTop } from "@/components/ui/BackToTop";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://www.irzzenproductions.fr/#business",
      "name": "Irzzen Productions",
      "description": "Photographe et vidéaste spécialisé dans le mariage haut de gamme à Paris et en Île-de-France.",
      "url": "https://www.irzzenproductions.fr",
      "telephone": "+33185094542",
      "email": "contact@irzzenproductions.fr",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Paris",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "areaServed": ["Paris", "Île-de-France", "France"],
      "priceRange": "€€€",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "200",
        "bestRating": "5"
      },
      "sameAs": [
        "https://www.instagram.com/irzzenproductions",
        "https://www.youtube.com/@irzzenproductions"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.irzzenproductions.fr/#service",
      "name": "Photographie & Vidéographie de Mariage",
      "provider": { "@id": "https://www.irzzenproductions.fr/#business" },
      "serviceType": "Wedding Photography and Videography",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "lowPrice": "890",
        "highPrice": "3890"
      }
    }
  ]
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <DisponibiliteBanner />
      <BackToTop />
    </>
  );
}
