import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Irzzen Productions | Photographe & Vidéaste Mariage Premium",
    template: "%s | Irzzen Productions",
  },
  description:
    "Photographe et vidéaste mariage haut de gamme. 15 ans d'expérience, équipe de 12 professionnels. Capturez chaque émotion de votre jour J avec élégance.",
  keywords: [
    "photographe mariage",
    "vidéaste mariage",
    "photo mariage premium",
    "film mariage",
    "photographe mariage luxe",
    "reportage photo mariage",
  ],
  authors: [{ name: "Irzzen Productions" }],
  creator: "Irzzen Productions",
  metadataBase: new URL("https://www.irzzenproductions.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.irzzenproductions.fr",
    siteName: "Irzzen Productions",
    title: "Irzzen Productions | Photographe & Vidéaste Mariage Premium",
    description:
      "15 ans d'expérience. Équipe de 12 professionnels. Votre mariage mérite d'être immortalisé avec art.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Irzzen Productions | Photographe & Vidéaste Mariage Premium",
    description: "15 ans d'expérience. Équipe de 12 professionnels.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
