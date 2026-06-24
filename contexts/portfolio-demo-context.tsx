"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MappedPublicPortfolio } from "@/lib/api/mappers";

const PortfolioDemoContext = createContext<MappedPublicPortfolio | null>(null);

export function PortfolioDemoProvider({
  value,
  children,
}: {
  value: MappedPublicPortfolio;
  children: ReactNode;
}) {
  return (
    <PortfolioDemoContext.Provider value={value}>
      {children}
    </PortfolioDemoContext.Provider>
  );
}

export function useOptionalDemoPortfolio() {
  return useContext(PortfolioDemoContext);
}
