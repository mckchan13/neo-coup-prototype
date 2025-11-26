import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { GlobalContext, defaultContext } from "./context.ts";
import type { CoupGameContext } from "../statemachine/statemachine.ts";
import {
  MockEvents,
  MockNetwork,
  mockServerRouteHandlers,
  type SessionId,
} from "../MockServer/mockServer.ts";
import type { GameEvent } from "../statemachine/statemachine2.ts";

export interface GlobalProviderProps {
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
    const cleanUpFunctions = [
      MockNetwork.createListener(MockEvents.MOCK_HTTP_REQUEST, (event) => {
        const { route, request } = event.detail;

        console.log("!!!!!!", route, request);

        if (route === "processEvent") {
          const { sessionId, event } = request as {
            sessionId: SessionId;
            event: GameEvent;
          };

          const { gameContext } = mockServerRouteHandlers.processEvent({
            sessionId,
            event,
          });

          setGlobalContext((prev) => ({ ...prev }));
        } else if (route === "initializeGame") {
        }
      }),
    ];

    return () => {
      for (const cleanUpFunction of cleanUpFunctions) {
        cleanUpFunction();
      }
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
