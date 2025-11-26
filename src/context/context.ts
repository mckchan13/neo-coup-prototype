import { createContext } from "react";
import type { CoupGameContext } from "../statemachine";
import type { SetStateFunction } from "../App";

export const defaultContext: CoupGameContext = {
  sessionId: "",
  players: [],
  initialized: false,
  started: false,
  currentPlayer: -1,
  currentRound: -1,
  numberOfPlayers: 0,
  playStack: [],
  deck: []
} as const;

export interface IGlobalContext {
  globalContext: CoupGameContext;
  setGlobalContext: SetStateFunction<CoupGameContext>;
}

export const GlobalContext = createContext<IGlobalContext>({
  globalContext: defaultContext,
  setGlobalContext: () => {},
});
