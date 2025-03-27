import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { GlobalContext, defaultContext } from "./context.ts";
import type { CoupGameContext } from "../statemachine/statemachine.ts";
// import { sendRequest } from "../MockServer/mockServer.ts";
import { MockNetwork } from "../MockServer/mockServer.ts";

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

  // Listen for a custom event from the mock server
  useEffect(() => {
    const { cleanUpFunction } = MockNetwork.listenForMockHttpRequest(
      (event) => {
        console.log("This is the event: ", event);
      }
    );

    const mockServerRequestEventListener = (event: Event) => {
      console.log("The mock server request: ", event);
    };

    document.body.addEventListener(
      "mockHttpRequest",
      mockServerRequestEventListener
    );

    const mockWebSocketEventListener = (event: Event) => {
      console.log("The web socket event: ", event);
    };

    document.body.addEventListener(
      "mockWebSocketMessage",
      mockWebSocketEventListener
    );

    return () => {
      cleanUpFunction();

      document.body.removeEventListener(
        "mockHttpRequest",
        mockServerRequestEventListener
      );

      document.body.removeEventListener(
        "mockWebSocketMessage",
        mockWebSocketEventListener
      );
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("coupGameState", JSON.stringify(globalContext));
  }, [globalContext]);

  return (
    <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
      {children}
    </GlobalContext.Provider>
  );
};
