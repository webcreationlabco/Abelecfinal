import type { Metadata } from "next";
import { Roboto_Slab, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LocaleDetector from "@/components/locale-detector";
import fr from "@/locales/fr.json";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-slab",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abelec — La pièce détachée électroménager depuis 1983",
  description:
    "100 000 références de pièces détachées électroménager en stock. Livraison 48h dans 6 pays européens. Helpdesk humain. Entreprise familiale belge fondée en 1983.",
  keywords: ["pièces détachées", "électroménager", "Belgique", "lave-linge", "réfrigérateur"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-dark-32x32.png", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Abelec — La pièce détachée depuis 1983",
    description: "100 000 références en stock · Livraison 48h · 6 pays",
    locale: "fr_BE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${robotoSlab.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <I18nProvider
          initialLocale="fr"
          initialTranslations={fr as Record<string, unknown>}
        >
          <LocaleDetector />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
