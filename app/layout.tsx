import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ThemeRegistry from "./ThemeRegistry";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import AuthModal from "@/features/auth/components/AuthModal";
import RootLoader from "@/components/common/RootLoader";

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
        <RootLoader />
        <AuthProvider>
          <ThemeRegistry>
            <Providers>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <AuthModal />
            </Providers>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
