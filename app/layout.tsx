import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ThemeRegistry from "./ThemeRegistry";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AppLoader from "@/components/common/AppLoader";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import { BookingProvider } from "@/features/booking/context/BookingContext";
import BookingModal from "@/features/booking/components/BookingModal";
import UnauthorizedHandler from "@/components/common/UnauthorizedHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDF8F1]">
        <AuthProvider>
          <BookingProvider>
            <ThemeRegistry>
              <Providers>
                <Header />
                <main className="flex-1">
                  <AppLoader>{children}</AppLoader>
                </main>
                <Footer />
                {/* Auth modal — always mounted */}
                <AuthModal />
                {/* Booking modal — always mounted, opens on demand */}
                <BookingModal />
                {/* Closes all modals and opens login on any 401 response */}
                <UnauthorizedHandler />
              </Providers>
            </ThemeRegistry>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
