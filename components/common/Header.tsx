"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext";
import { GetUserDetails } from "@/services/apiCalls/login.service";

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, openLoginModal, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch full user profile using `sub` from JWT cookie
  const { data: userDetailData } = GetUserDetails(user?.sub) as any;

  const displayName =
    user?.ssoid ??
    userDetailData?.result?.displayName ??
    user?.displayName ??
    user?.fullName ??
    user?.email ??
    "";

  const navLinks = [
    { label: "Explore", href: "#destinations" },
    { label: "Packages", href: "#packages" },
    { label: "Monuments", href: "#monuments" },
    { label: "Wildlife", href: "#wildlife" },
    { label: "RTDC Hotels", href: "#rtdc" },
    { label: "JKK", href: "#venues" },
    { label: "Parks", href: "#parks" },
    { label: "App", href: "#app" },
    { label: "Reviews", href: "#feedback" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-300 h-16 md:h-[66px] flex items-center justify-between px-6 md:px-8 bg-[rgba(253,248,241,0.96)] backdrop-blur-[24px] border-b border-[rgba(212,160,23,0.14)] shadow-[0_1px_6px_rgba(24,18,14,0.06)]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#E8631A] to-[#D4A017] flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(232,99,26,0.3)] flex-shrink-0">
            🏯
          </div>
          <div>
            <strong className="font-['Playfair_Display',serif] text-xs font-bold text-[#2C2017] block">
              Rajasthan Tourism
            </strong>
            <small className="text-[9px] font-semibold tracking-[0.8px] uppercase text-[#E8631A]">
              Online Booking Management System
            </small>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={clsx(
                "text-sm font-medium transition-colors duration-200",
                activeLink === link.href
                  ? "text-[#E8631A]"
                  : "text-[#7A6A58] hover:text-[#E8631A]",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Auth area — render nothing until mounted to prevent SSR/hydration flicker */}
          {!mounted ? (
            <div className="hidden md:block w-24 h-8 rounded-full bg-[#F5E8CC] animate-pulse" />
          ) : user ? (
            /* ── User dropdown (desktop) ── */
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-[#E8631A] text-white text-[13px] font-semibold rounded-full transition-all hover:opacity-90 shadow-[0_2px_8px_rgba(232,99,26,0.3)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                <span className="max-w-[110px] truncate">{displayName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <ul className="absolute right-0 mt-2 min-w-[170px] overflow-hidden rounded-xl border border-[#E8DAC5] bg-white shadow-[0_8px_24px_rgba(24,18,14,0.12)] z-[1200]">
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/my-bookings");
                    }}
                    className="px-4 py-2.5 text-[13px] text-[#18120E] cursor-pointer hover:bg-[#F5E8CC]"
                  >
                    My Bookings
                  </li>
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/my-grievance");
                    }}
                    className="px-4 py-2.5 text-[13px] text-[#18120E] cursor-pointer hover:bg-[#F5E8CC]"
                  >
                    My Grievance
                  </li>
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="px-4 py-2.5 text-[13px] text-[#18120E] cursor-pointer hover:bg-[#F5E8CC]"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="hidden md:block px-5 py-2 bg-[#E8631A] text-white text-sm font-semibold rounded-full transition-all duration-200 hover:bg-[#C04E0A] hover:translate-y-[-1px]"
            >
              Login
            </button>
          )}

          <button className="px-3.5 py-2 bg-[#DC2626] text-white text-xs font-bold rounded-full transition-all duration-200 hover:shadow-lg animate-pulse">
            🆘 SOS
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className="lg:hidden flex flex-col gap-1.5 bg-transparent p-1.5 rounded-lg"
            aria-expanded={isDrawerOpen}
            aria-controls="drawer"
            aria-label="Open navigation menu"
          >
            <span
              className={clsx(
                "block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300",
                isDrawerOpen ? "rotate-45 translate-y-[13px]" : "",
              )}
            />
            <span
              className={clsx(
                "block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300",
                isDrawerOpen ? "opacity-0" : "",
              )}
            />
            <span
              className={clsx(
                "block w-5.5 h-0.5 bg-[#2C2017] rounded transition-all duration-300",
                isDrawerOpen ? "-rotate-45 -translate-y-[13px]" : "",
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="drawer"
        className={clsx(
          "lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-[#E8DAC5] px-6 py-4 z-290 flex flex-col gap-0.5 shadow-[0_12px_48px_rgba(24,18,14,0.16)] transition-all duration-300 origin-top",
          isDrawerOpen
            ? "opacity-100 visible scale-y-100"
            : "opacity-0 invisible scale-y-95",
        )}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => handleNavClick(link.href)}
            className="px-4 py-3 text-[#2C2017] rounded-[10px] transition-colors duration-150 hover:bg-[#F5E8CC] no-underline block"
          >
            {link.label}
          </a>
        ))}

        <div className="flex flex-col gap-2 mt-3 pt-3.5 border-t border-[#E8DAC5]">
          {!mounted ? (
            <div className="h-10 rounded-[10px] bg-[#F5E8CC] animate-pulse" />
          ) : user ? (
            <>
              <span className="px-4 py-2.5 text-[13px] font-semibold text-[#2C2017] bg-[#F5E8CC] rounded-[10px] truncate">
                👤 {displayName}
              </span>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push("/my-bookings");
                }}
                className="px-4 py-2.5 text-[13px] text-left text-[#18120E] rounded-[10px] hover:bg-[#F5E8CC] transition-colors"
              >
                My Bookings
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push("/my-grievance");
                }}
                className="px-4 py-2.5 text-[13px] text-left text-[#18120E] rounded-[10px] hover:bg-[#F5E8CC] transition-colors"
              >
                My Grievance
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  logout();
                }}
                className="px-4 py-2.5 text-[13px] text-left text-[#18120E] rounded-[10px] hover:bg-[#F5E8CC] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                openLoginModal();
                setIsDrawerOpen(false);
              }}
              className="w-full px-4 py-2.75 bg-[#E8631A] text-white text-sm font-bold rounded-full transition-all duration-200 hover:bg-[#C04E0A]"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Spacer for fixed nav */}
      <div className="h-16 md:h-[66px]" />
    </>
  );
}
