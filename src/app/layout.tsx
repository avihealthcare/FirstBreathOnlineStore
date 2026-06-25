import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://firstbreath.avihealthcare.com"),
  title: {
    default: "AVI FirstBreath Store | Neonatal Consumables for Hospitals",
    template: "%s | AVI FirstBreath Store"
  },
  description:
    "Premium neonatal consumables and disposable items for NICUs, pediatric departments, hospitals, and distributors.",
  keywords: [
    "neonatal consumables",
    "NICU disposable items",
    "CPAP consumables",
    "neonatal breathing circuit",
    "AVI Healthcare"
  ],
  openGraph: {
    title: "AVI FirstBreath Store",
    description: "Trusted neonatal consumables for NICUs and hospitals.",
    images: ["/images/logo-firstbreath.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
