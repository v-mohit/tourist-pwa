"use client";
import React, { useEffect } from "react";

interface StrapiImageData {
  attributes: {
    url: string;
    alternativeText?: string | null;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

export interface PriceEntry {
  title: string;
  price: string | null;
  note: string | null;
}

interface PlaceItem {
  name: string;
  priceType: string | null;
  remark: string | null;
  description?: string | null;
  capacity?: string | null;
  images?: {
    data?: StrapiImageData[] | null;
  } | null;
  prices: PriceEntry[];
}

const JkkPricingModal: React.FC<{ place: PlaceItem; onClose: () => void }> = ({
  place,
  onClose,
}) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  function formatPrice(price: string | null, note: string | null): string {
    if (price === null) return note ?? "—";
    const n = parseFloat(price);
    if (isNaN(n)) return price;
    return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(24,18,14,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",       // ← centered
        justifyContent: "center",   // ← centered
        padding: "16px",            // ← breathing room on all sides
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",     // ← all corners rounded
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(24,18,14,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg,#E8631A,#FF69B4)",
            padding: "16px 20px",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 700,
                letterSpacing: "0.9px",
                margin: "0 0 4px",
                textTransform: "uppercase",
              }}
            >
              Pricing Details
            </p>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              {place.name}
            </h3>
            {place.priceType && (
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.75)",
                  margin: "4px 0 0",
                }}
              >
                {place.priceType}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 32px" }}>
          {place.prices.length === 0 ? (
            <p
              style={{
                fontSize: "13px",
                color: "#7A6A58",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Contact us for pricing information.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {place.prices.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 14px",
                    background: i % 2 === 0 ? "#FFF0F7" : "#fff",
                    borderRadius: "10px",
                    border: "1px solid #FFD6E8",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#2C2017",
                      lineHeight: 1.55,
                      flex: 1,
                    }}
                  >
                    {entry.title}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#E8631A",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(entry.price, entry.note)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {place.remark && (
            <div
              style={{
                marginTop: "16px",
                background: "#FFF9EC",
                border: "1px solid #F0C842",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: "#7A6A58",
                  fontWeight: 700,
                  marginBottom: "6px",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                }}
              >
                Note
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#2C2017",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {place.remark}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg,#E8631A,#FF69B4)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "13px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JkkPricingModal;