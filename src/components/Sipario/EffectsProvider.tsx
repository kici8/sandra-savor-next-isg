"use client";
import { createContext, useContext, useRef } from "react";
import { SiparioEffectsManager } from "./EffectsManager";

type SiparioEffectsContextValue = {
  manager: SiparioEffectsManager;
};

const SiparioEffectsContext = createContext<SiparioEffectsContextValue | null>(
  null,
);

export const useSiparioEffects = () => {
  const ctx = useContext(SiparioEffectsContext);
  if (!ctx) throw new Error("useEffects must be used within <EffectsProvider>");
  return ctx.manager;
};

export const SiparioEffectsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const manager = useRef(new SiparioEffectsManager()).current;

  return (
    <SiparioEffectsContext.Provider value={{ manager }}>
      {children}
    </SiparioEffectsContext.Provider>
  );
};
