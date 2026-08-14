import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deysiane & Pedro | 22 de maio de 2027",
  description:
    "Site do casamento de Deysiane Sobrinho e Pedro Gledson — 22 de maio de 2027. Confirme presença, veja o local, o dress code e presenteie o casal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <AuthProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
