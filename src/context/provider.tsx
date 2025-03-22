import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { GlobalContext, defaultContext } from "./context.ts";
import type { CoupGameContext } from "../statemachine/statemachine.ts";

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({
  children,
}: GlobalProviderProps): JSX.Element => {
  const currentContext = JSON.parse(
    sessionStorage.getItem("coupGameState") || JSON.stringify(defaultContext)
  );

  const [globalContext, setGlobalContext] =
    useState<CoupGameContext>(currentContext);

  useEffect(() => {
    sessionStorage.setItem("coupGameState", JSON.stringify(globalContext));
  }, [globalContext]);

  return (
    <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
      {children}
    </GlobalContext.Provider>
  );
};
