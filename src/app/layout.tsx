import type { Metadata } from "next";
import { Inter, Playfair_Display, Oswald } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"] });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700"] });

export const metadata: Metadata = {
  title: "AutoImport Pro – Importación de Vehículos de Lujo",
  description: "Plataforma profesional de importación y venta de vehículos de lujo. Coches premium al mejor precio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full theme-noche ${inter.variable} ${playfair.variable} ${oswald.variable}`}>
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ThemeSwitcher />
            <ToastContainer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
