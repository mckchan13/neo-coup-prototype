import { useContext } from "react";
import { startGame } from "../statemachine";
import { GlobalContext } from "../context";
import { createPlayer, Player } from "../types";
import { GameMaster } from "../GameMaster/GameMaster.ts";

export default function AddPlayerButtons() {
  const { globalContext, setGlobalContext } = useContext(GlobalContext);
  
  return (
    <>
      {new Array(5).fill(0).map((_, index, array) => {
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

          const players: Player[] = names.map((name, idx) => {
            return createPlayer(name, idx);
          });

          return () => {
            const gm = new GameMaster();
            gm.shuffle();

            const persistedState = startGame(
              {
                currentPlayer: -1,
                currentRound: -1,
                numberOfPlayers: numOfPlayers,
                sessionId: globalContext.sessionId,
                players,
                initialized: true,
                started: true,
                playStack: [],
                deck: gm.cardDeck,
              },
              globalContext.sessionId
            );

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
      })}
    </>
  );
}
