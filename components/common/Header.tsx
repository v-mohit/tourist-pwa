"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext";
import { GetUserDetails } from "@/services/apiCalls/login.service";
import SosPopup from "@/components/modals/SosPopup";

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
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
    { label: "Explore", href: "/#destinations" },
    { label: "Packages", href: "/#packages" },
    { label: "Monuments", href: "/#monuments" },
    { label: "Wildlife", href: "/#wildlife" },
    { label: "RTDC Hotels", href: "/#rtdc" },
    { label: "JKK", href: "/#venues" },
    { label: "Parks", href: "/#parks" },
    { label: "App", href: "/#app" },
    { label: "Reviews", href: "/#feedback" },
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

  useEffect(() => {
    const handleOpenSos = () => setIsSosOpen(true);
    window.addEventListener("app:openSos", handleOpenSos);
    return () => window.removeEventListener("app:openSos", handleOpenSos);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <SosPopup isOpen={isSosOpen} setIsOpen={setIsSosOpen} />
      {/* Navigation */}
      <nav className="header-nav">
        {/* Brand */}
        <Link href="/" className="header-brand">
          <div className="header-brand-icon">
            🏯
          </div>
          <div>
            <strong className="header-brand-title">
              Rajasthan Tourism
            </strong>
            <small className="header-brand-subtitle">
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
                "header-nav-link",
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
                className="header-user-btn"
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
                <ul className="header-dropdown-menu">
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/my-bookings");
                    }}
                    className="header-dropdown-item"
                  >
                    My Bookings
                  </li>
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/my-grievance");
                    }}
                    className="header-dropdown-item"
                  >
                    My Grievance
                  </li>
                  <li
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="header-dropdown-item"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="header-login-btn"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setIsSosOpen(true)}
            className="fab-sos-header"
          >
            🆘 SOS
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className="header-hamburger"
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
          "header-drawer",
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
            className="header-drawer-link"
          >
            {link.label}
          </a>
        ))}

        <div className="flex flex-col gap-2 mt-3 pt-3.5 border-t border-[#E8DAC5]">
          {!mounted ? (
            <div className="h-10 rounded-[10px] bg-[#F5E8CC] animate-pulse" />
          ) : user ? (
            <>
              <span className="header-drawer-user-info">
                👤 {displayName}
              </span>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push("/my-bookings");
                }}
                className="header-drawer-btn"
              >
                My Bookings
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push("/my-grievance");
                }}
                className="header-drawer-btn"
              >
                My Grievance
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  logout();
                }}
                className="header-drawer-btn"
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
              className="header-drawer-login"
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
