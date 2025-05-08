"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';

interface ChangesContextType {
  changes: string;
  setChanges: (changes: string) => void;
}

const ChangesContext = createContext<ChangesContextType | undefined>(undefined);

export function ChangesProvider({ children }: { children: ReactNode }) {
  const [changes, setChanges] = useState<string>("");
  return (
    <ChangesContext.Provider value={{ changes, setChanges }}>
      {children}
    </ChangesContext.Provider>
  );
}

export function useChanges() {
  const context = useContext(ChangesContext);
  if (!context) {
    throw new Error("useChanges must be used within a ChangesProvider");
  }
  return context;
}
