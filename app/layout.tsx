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

const cinzel = localFont({
  src: [
    {
      path: "../public/fonts/cinzel/Cinzel-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/cinzel/Cinzel-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cinzel",
});

const raleway = localFont({
  src: [
    {
      path: "../public/fonts/raleway/Raleway-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/raleway/Raleway-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-raleway",
});

const playfair = localFont({
  src: [
    {
      path: "../public/fonts/playfair/PlayfairDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/playfair/PlayfairDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
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

import AppLoader from "@/components/common/AppLoader";

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
              <AppLoader>
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
              </AppLoader>
            </Providers>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

