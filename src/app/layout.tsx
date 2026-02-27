import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Onboarding from "@/components/Onboarding";
import Navigation from "@/components/Navigation";
import AuthWrapper from "@/components/AuthWrapper";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PUIS Catamarca | Plataforma Unificada de Información en Salud",
  description: "Sistema integral de gestión de salud del Ministerio de Salud de Catamarca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex flex-col min-h-screen bg-white">
        {/* Top Accent Bar */}
        <div className="h-1 w-full bg-[#f9b000] sticky top-0 z-[100]" />

        <AuthWrapper>
          {children}
        </AuthWrapper>

        <Onboarding />
      </body>
    </html>
  );
}
