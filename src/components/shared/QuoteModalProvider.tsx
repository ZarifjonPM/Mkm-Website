"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface QuoteModalContextType {
  isOpen: boolean;
  prefill: { category?: string; productName?: string };
  openQuoteModal: (prefill?: {
    category?: string;
    productName?: string;
  }) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<{
    category?: string;
    productName?: string;
  }>({});

  const openQuoteModal = (data?: {
    category?: string;
    productName?: string;
  }) => {
    setPrefill(data ?? {});
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
    setPrefill({});
  };

  return (
    <QuoteModalContext.Provider
      value={{ isOpen, prefill, openQuoteModal, closeQuoteModal }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx)
    throw new Error("useQuoteModal must be used within QuoteModalProvider");
  return ctx;
}
