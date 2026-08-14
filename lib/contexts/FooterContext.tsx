"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FooterContextType {
  isFooterVisible: boolean;
  setIsFooterVisible: (visible: boolean) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  return (
    <FooterContext.Provider value={{ isFooterVisible, setIsFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooterVisibility = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error("useFooterVisibility must be used within FooterProvider");
  }
  return context;
};
