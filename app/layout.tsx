import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Архитектура улыбки | Дом функциональной стоматологии",
  description: "Современная функциональная стоматология в Новосибирске.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
