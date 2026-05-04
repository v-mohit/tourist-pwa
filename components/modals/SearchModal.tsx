"use client";

import React from "react";
import { Dialog, Slide, IconButton } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import SearchBar from "@/features/home/components/SearchBar";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface SearchModalProps {
  isOpen: boolean;
  setIsOpen: (bool: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, setIsOpen }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      zIndex={10000}
      sx={{
        zIndex: 10000,
      }}
      PaperProps={{
        className: "search-modal-paper",
        sx: {
          borderRadius: "24px",
          padding: "24px",
          background: "var(--cream)",
          overflow: "visible",
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-playfair text-[var(--ink)]">
            Search Your Destination
          </h2>
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: "var(--mu)",
              "&:hover": { color: "var(--sf)" }
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        
        <div className="py-2">
          <SearchBar onSelect={handleClose} variant="modal" />
        </div>
        
        <p className="text-xs text-[var(--mu)] text-center mt-2">
          Try searching for "Amer Fort", "Jodhpur", or "Wildlife"
        </p>
      </div>
    </Dialog>
  );
};

export default SearchModal;
