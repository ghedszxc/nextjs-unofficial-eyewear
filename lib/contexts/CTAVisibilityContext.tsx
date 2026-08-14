"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CTAContextType {
  isCTAVisible: boolean;
  setIsCTAVisible: (visible: boolean) => void;
}

const CTAContext = createContext<CTAContextType | undefined>(undefined);

export const CTAProvider = ({ children }: { children: ReactNode }) => {
  const [isCTAVisible, setIsCTAVisible] = useState(false);

  return (
    <CTAContext.Provider value={{ isCTAVisible, setIsCTAVisible }}>
      {children}
    </CTAContext.Provider>
  );
};

export const useCTAVisibility = () => {
  const context = useContext(CTAContext);
  if (!context) {
    throw new Error("useCTAVisibility must be used within CTAProvider");
  }
  return context;
};
