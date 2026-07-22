import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dental-site-delta.vercel.app"),
  title: {
    default: "Архитектура улыбки — функциональная стоматология в Новосибирске",
    template: "%s | Архитектура улыбки",
  },
  description:
    "Дом функциональной стоматологии в Новосибирске. Диагностика, терапия, хирургия, ортопедия, ортодонтия и профессиональная гигиена.",
  keywords: ["стоматология Новосибирск", "функциональная стоматология", "имплантация"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Архитектура улыбки",
    title: "Архитектура улыбки — дом функциональной стоматологии",
    description: "Осознанная диагностика, бережное лечение и восстановление улыбки в одной команде.",
    images: [{ url: "/interiors/reception.jpg", width: 1200, height: 800 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
