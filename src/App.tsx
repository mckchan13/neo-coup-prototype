import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import {
  CoupGameContext,
  startGame,
  sendEvent,
  createSession,
  UUID,
  resetDatabase,
} from "./statemachine/index.ts";
import { defaultContext, GlobalContext } from "./context";

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
                <Card
                  key={player.name}
                  disabled={globalContext.currentPlayer !== i}
                  playerId={i}
                  {...player}
                ></Card>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default App;

function Card(props: {
  name: string;
  coins: number;
  disabled: boolean;
  playerId: number;
}): JSX.Element {
  const { globalContext, setGlobalContext } = useContext(GlobalContext);
  const { name, coins, playerId } = props;

  const disabled = globalContext.currentPlayer !== playerId;

  function createSendEventClickHandler(event: {
    type: "Coup" | "Character Action";
  }) {
    return () => {
      const response = sendEvent(event, globalContext.sessionId as UUID);
      console.log(`${event.type} response`, response);
      const [error, updatedGameState] = response;

      if (error !== null || updatedGameState === null) {
        console.error(error.message);
        throw new Error(`${event.type} failed`);
      }

      sessionStorage.setItem("coupGameState", JSON.stringify(updatedGameState));

      setGlobalContext((prevState) => ({
        ...prevState,
        ...updatedGameState.context,
      }));
    };
  }

  const handleClickCoup = createSendEventClickHandler({ type: "Coup" });

  const handleClickCharacterEvent = createSendEventClickHandler({
    type: "Character Action",
  });

  return (
    <div
      style={{
        display: "inline-block",
        marginRight: "1rem",
        marginLeft: "1rem",
        width: "125px",
        height: "200px",
        border: "solid 1px black",
      }}
    >
      <p
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        }}
      >
        Name: {name}
      </p>
      <p
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        }}
      >
        Coins: {coins}
      </p>
      <div className="action-section">
        <h3
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content",
          }}
        >
          Actions
        </h3>
        <div style={{ width: "fit-content" }} className="action-buttons">
          <button
            onClick={handleClickCoup}
            disabled={disabled}
            style={{ width: "100%" }}
          >
            Coup
          </button>
          <button
            onClick={handleClickCharacterEvent}
            disabled={disabled}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Character Action
          </button>
          <button
            onClick={handleClickCharacterEvent}
            disabled={disabled}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Character Action
          </button>
          <PlayerActionButton
            onClick={() => {}}
            disabled={true}
            style={{}}
            title="Income"
          />
        </div>
      </div>
    </div>
  );
}

export interface PlayerActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  style: React.CSSProperties;
  title: string;
}

export function PlayerActionButton(props: PlayerActionButtonProps) {
  const { onClick, disabled, style, title } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", marginTop: "10px", ...style }}
    >
      {title}
    </button>
  );
}
