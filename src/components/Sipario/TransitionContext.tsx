"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type PageTransitionContextType = {
  isTransitioning: boolean;
  setIsTransitioning: Dispatch<SetStateAction<boolean>>;
  toRoute: string | null;
  setToRoute: Dispatch<SetStateAction<string | null>>;
  fromRoute: string | null;
  setFromRoute: Dispatch<SetStateAction<string | null>>;
};

export const PageTransitionContext = createContext<
  PageTransitionContextType | undefined
>(undefined);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}

import { ReactNode } from "react";

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toRoute, setToRoute] = useState<string | null>(null);
  const [fromRoute, setFromRoute] = useState<string | null>(null);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        setIsTransitioning,
        toRoute,
        setToRoute,
        fromRoute,
        setFromRoute,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}
