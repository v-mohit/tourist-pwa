"use client";
import React from "react";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        className: "sos-paper",
      }}
    >
      <div className="sos-btn-list">
        {emergencyNumbers.map((item) => (
          <a
            key={item.number}
            href={`tel:${item.number}`}
            className="sos-emergency-btn"
          >
            {item.label} - {item.number}
          </a>
        ))}

        <button
          onClick={closePopup}
          className="sos-modal-close-btn"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default SosPopup;
