"use client";
import React from "react";
import { Dialog } from "@mui/material";

interface SosPopupProps {
  isOpen: boolean;
  setIsOpen: (bool: boolean) => void;
}

const SosPopup: React.FC<SosPopupProps> = ({ isOpen, setIsOpen }) => {
  const closePopup = () => {
    setIsOpen(false);
  };

  const emergencyNumbers = [
    { label: "Police", number: "100" },
    { label: "Police Control Room", number: "112" },
    { label: "Traffic Police", number: "1095" },
    { label: "Ambulance", number: "102" },
    { label: "Fire brigade", number: "101" },
    { label: "Emergency", number: "108" },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={closePopup}
      PaperProps={{
        style: {
          width: "300px",
          margin: "auto",
          borderRadius: "16px",
          padding: "16px",
        },
      }}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-center font-bold text-lg text-[#DC2626] mb-2">Emergency Contacts</h3>
        {emergencyNumbers.map((item) => (
          <a
            key={item.number}
            href={`tel:${item.number}`}
            className="sos-emergency-btn"
          >
            {item.label}: {item.number}
          </a>
        ))}
        <button
          onClick={closePopup}
          className="sos-close-btn"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default SosPopup;
