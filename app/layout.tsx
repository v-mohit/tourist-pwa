import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import { BookingProvider } from "@/features/booking/context/BookingContext";
import BookingModal from "@/features/booking/components/BookingModal";
import UnauthorizedHandler from "@/components/common/UnauthorizedHandler";
import FloatingHelpdesk from "@/components/helpdesk/FloatingHelpdesk";

import { Cinzel, Raleway, Playfair_Display } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/geist/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/geist/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist",
});

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/geist/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Rajasthan Tourism - OBMS",
  description: "Official Online Booking Management System for Rajasthan Tourism",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${raleway.variable} ${playfair.variable}`}
    >
      <body>
        <AuthProvider>
          <BookingProvider>
            <Providers>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              {/* Auth modal — always mounted */}
              <AuthModal />
              {/* Booking modal — always mounted, opens on demand */}
              <BookingModal />
              {/* Closes all modals and opens login on any 401 response */}
              <UnauthorizedHandler />
              {/* Floating Helpdesk Widget */}
              <FloatingHelpdesk />
            </Providers>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
