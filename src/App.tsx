import type React from "react";
import { useContext } from "react";
import "./App.css";
import { createSession, resetDatabase } from "./statemachine/index.ts";
import { defaultContext, GlobalContext } from "./context";
import PlayerCard from "./components/PlayerCard.tsx";
import AddPlayerButtons from "./components/AddPlayerButtons.tsx";

export type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

function App() {
  const { globalContext, setGlobalContext } = useContext(GlobalContext);

  return (
    <>
      <div className="session-title">{globalContext.sessionId}</div>
      <div className="app-container">
        <button
          type="button"
          disabled={globalContext.sessionId !== ""}
          className="start-button"
          onClick={() => {
            const sessionId = createSession();
            setGlobalContext({
              ...defaultContext,
              sessionId,
              initialized: true,
            });
          }}
        >
          Start Game
        </button>
        <button
          type="button"
          disabled={globalContext.sessionId === ""}
          className="reset-button"
          onClick={() => {
            resetDatabase();
            setGlobalContext(defaultContext);
          }}
        >
          Reset Game
        </button>
      </div>
      {globalContext.initialized && !globalContext.started && (
        <div className="add-players-container">
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content",
              marginTop: "25px",
            }}
          >
            How many players would you like to add?
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content",
              marginTop: "25px",
            }}
          >
            <AddPlayerButtons />
          </div>
        </div>
      )}
      {globalContext.initialized && globalContext.started && (
        <>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content",
              marginTop: "25px",
            }}
          >
            Game started!
          </div>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "fit-content",
              marginTop: "25px",
            }}
          >
            {globalContext.players.map((player, i) => {
              return (
                <PlayerCard
                  key={player.name}
                  disabled={globalContext.currentPlayer !== i}
                  playerId={i}
                  {...player}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default App;
