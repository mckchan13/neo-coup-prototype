import React, { useContext } from "react";
import "./App.css";
import {
  startGame,
  createSession,
  resetDatabase,
} from "./statemachine/index.ts";
import { defaultContext, GlobalContext } from "./context";
import PlayerCard from "./components/PlayerCard.tsx";

export type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

function App() {
  const { globalContext, setGlobalContext } = useContext(GlobalContext);

  const addPlayerButtons = new Array(5).fill(0).map((_, index, array) => {
    const buttonProps = {
      style: {
        width: "100px",
        ...(index !== 0 || index !== array.length - 1
          ? { marginLeft: "20px" }
          : {}),
      },
    };

    function createAddPlayerClickHandler(numOfPlayers: number) {
      const names = [
        "Michael",
        "James",
        "Vince",
        "David",
        "Lucy",
        "Rebecca",
      ].filter((_, idx) => idx < numOfPlayers);

      const players = names.map((name, idx) => {
        return {
          id: idx,
          name,
          coins: 2,
        };
      });

      return () => {
        const persistedState = startGame(
          {
            currentPlayer: -1,
            currentRound: -1,
            numberOfPlayers: numOfPlayers,
            sessionId: globalContext.sessionId,
            players,
            initialized: true,
            started: true,
          },
          globalContext.sessionId
        );

        console.log("!!!", persistedState);

        setGlobalContext((prevState) => {
          return {
            ...prevState,
            ...persistedState.context,
          };
        });
      };
    }

    return (
      <button
        key={index}
        onClick={createAddPlayerClickHandler(index + 2)}
        {...buttonProps}
      >
        {index + 2}
      </button>
    );
  });

  return (
    <>
      <div className="session-title">{globalContext.sessionId}</div>
      <div className="app-container">
        <button
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
            {addPlayerButtons}
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
                ></PlayerCard>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default App;
