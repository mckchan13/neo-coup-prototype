import { createContext } from "react";
import { CoupGameContext } from "../statemachine";
import { SetStateFunction } from "../App";

export const defaultContext: CoupGameContext = {
  sessionId: "",
  players: [],
  initialized: false,
  started: false,
  currentPlayer: -1,
  currentRound: -1,
  numberOfPlayers: 0,
} as const;

export interface IGlobalContext {
  globalContext: CoupGameContext;
  setGlobalContext: SetStateFunction<CoupGameContext>;
}

export const GlobalContext = createContext<IGlobalContext>({
  globalContext: defaultContext,
  setGlobalContext: () => {},
});
