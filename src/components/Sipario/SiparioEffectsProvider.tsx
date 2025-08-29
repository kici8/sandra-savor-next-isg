"use client";
import { createContext, useContext, useRef } from "react";
import * as THREE from "three";
import { useSiparioEffectsManager } from "./useSiparioEffectsManager";

type SiparioEffectsContextValue = ReturnType<typeof useSiparioEffectsManager>;

const SiparioEffectsContext = createContext<SiparioEffectsContextValue | null>(
  null,
);

export const useSiparioEffects = () => {
  const ctx = useContext(SiparioEffectsContext);
  if (!ctx)
    throw new Error(
      "useSiparioEffects must be used within <SiparioEffectsProvider>",
    );
  return ctx;
};

export const SiparioEffectsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const manager = useSiparioEffectsManager();

  return (
    <SiparioEffectsContext.Provider
      value={{
        ...manager,
      }}
    >
      {children}
    </SiparioEffectsContext.Provider>
  );
};
