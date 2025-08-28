"use client";
import { createContext, useContext, useRef } from "react";
import * as THREE from "three";
import { useSiparioEffectsManager } from "./useSiparioEffectsManager";

export type MeshRegistry = Map<string, React.RefObject<THREE.Mesh>>;

type SiparioEffectsContextValue = ReturnType<
  typeof useSiparioEffectsManager
> & {
  meshRegistry: MeshRegistry;
  registerMesh: (id: string, ref: React.RefObject<THREE.Mesh>) => void;
  unregisterMesh: (id: string) => void;
};

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
  const meshRegistry = useRef<MeshRegistry>(new Map());

  const registerMesh = (id: string, ref: React.RefObject<THREE.Mesh>) => {
    meshRegistry.current.set(id, ref);
  };
  const unregisterMesh = (id: string) => {
    meshRegistry.current.delete(id);
  };

  return (
    <SiparioEffectsContext.Provider
      value={{
        ...manager,
        meshRegistry: meshRegistry.current,
        registerMesh,
        unregisterMesh,
      }}
    >
      {children}
    </SiparioEffectsContext.Provider>
  );
};
