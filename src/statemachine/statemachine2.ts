import { type Action, assign, setup } from "xstate";
import { createNewGameContext } from "../MockServer";

export type TActionFunction = (
  actionArgs: { context: GameContext; event: GameEvent },
  params: unknown
) => void;

// need to type cast the action object type because TypeScript is unable to accurately infer the types
export type TActionsObjectType = {
  updateGameContext: TActionFunction;
  updateCurrentRound: TActionFunction;
  updateCurrentRoundInitialPlayerTurn: TActionFunction;
  updateAvailableActionsForCurrentPlayer: TActionFunction;
  disableActionsForAllOpposingPlayers: TActionFunction;
  computeResultsOfRound: TActionFunction;
  pushEventToPlayStack: TActionFunction;
  resetPlayStack: TActionFunction;
};

export type GameContext = {
  players: unknown[];
  started: boolean;
  playStack: unknown[];
  sessionId: string;
  intialized: boolean;
  currentRound: number;
  currentAction: string;
  currentPlayer: number;
  numberOfPlayers: number;
};

const config = {
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actions: {
    updateGameContext: assign({
      players: ({ context, event }, params) => {
        return [];
      },
      currentRound: ({ context, event }, params) => {
        return -1;
      },
    }),
    updateCurrentRoundInitialPlayerTurn: ({ context, event }, params) => {},
    updateCurrentRound: assign({
      currentRound: ({ context, event }, pararms) => {
        return (context.currentRound % context.numberOfPlayers) + 1;
      },
    }),
    updateAvailableActionsForCurrentPlayer: ({ context, event }, params) => {},
    disableActionsForAllOpposingPlayers: ({ context, event }, params) => {},
    computeResultsOfRound: ({ context, event }, params) => {},
    pushEventToPlayStack: assign({
      playStack: ({ context, event }) => {
        const currentPlayStack = context.playStack;
        const updatedPlayStack = [...currentPlayStack, event];
        return updatedPlayStack;
      },
    }),
    resetPlayStack: assign({
      playStack: () => {
        return [];
      },
    }),
  } as TActionsObjectType,
};

export const startStateMachine = (gameContext?: GameContext) => {
  const machine = setup(config).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGED2BXADgOgOIEMBbMAAgGUAXfAJwoGIBtABgF1FRNVYBLC71AHbsQAD0QAmcQDYALNgAcAdgCsAZmUBGRatXiZ4gDQgAnoi0yp2WTOVMlUxfKkBOcQF83RtFmwAlDAIQ5FS0jKzCnDx8gsJiCBqqMvIKznbyqs6KNhriikam8bKKKTZM2lI5yjKKHl4YOACCAMbRAiQACgAW+LBgdACSAk2oxMxsSCCRvPxCE3GSljaqGlWqKkxMUlLK+YjyGtgyzseJSisbyrUg3o0tMx3dvXQ3YxFc0zFzEtKHaisya1sm22u3iimKSyYiQB4IszikVxu2GarQePT6ADFUNQwNwoG0GtwIK8JlNWrFvos-qt1sCdiZELJnCllIpxIlpJIap5rvVkXdBGingAVfAiEkcd7kr4IBa-ZY0oFbekFGQaJiHLYJDRq8RMGRMVmIvko+5ddF0BqwWA9HgCfCtCWTKUzCmyn5Lf6AjbK0EaDTyZnQ5wWbXKFzGnymwXmp6UMD4AA2TrJrplcs9ip9IIZCHkagUaxWznDwJWkduqNjfQAoiImt0BDAUy7PqB5h7qTClTmCjrxMlYYoLiWZGqETyke1E-hjMF8E0ANYkXxwVCJgBu3CbdAA6tuBGBqC2omn25S5Eo1JptLp9H61skOezxK5ZC5LpO+dPZ-Olyu103bcoDoAA5VASH3ARD2PcJSVbWZz3dWQFBUdQtB0PRDFzftknkfQckNAcVCcCtsCxHE8QJIkAIAI3QCgqETIU+nAkhvAECgjxIaM2mxdjukTRMwCbMATw+RDREQYdigHBIdA0WQqgqUFS2wdQQykV91UyXQyIo3F8R4mjV3oxikxYugACFE1Qf8DKo4ziTgyVTzbKSEBk7A5J0ZYlNDUFtksZZ2VSapFJcbk6h8UURDohimMs5BBOE0TxOlJCcnhKwDXkcRlGcf171zccFDyxRIsDQNFM-aKcFi+LzOY6swIg5Kk1S5sXOdNzJLiLLLFkOx8sK-tQV0DVXHhHJ5Fm0NSK-KNrVtbcHXuUyEoslqbLs5crRta1VsdbrU3cuIvJ8hT-JUnD9WUbAskSW8pHUcQNDI-aVvtVENqayy2I4rjqB4gU+OB9qhJErrxlciS3Qu-ZfMUmwApwjQSweioKmWcEmH9KLeR8eMLN+xLtts-9ieTE6EPhspvMRq6UZugp81UQtFGLUstVqwmcCpxqycePoIc6sSad6unZMZvzmY0UEVHEbztiqbRtCYY5eaRAXSa24XWvYgIgZB1F+NFqHxZhnq4ZlBH5Nl5T5dzENmUUVJZa0jWEjIusG3wUTBb1i1zbSiWbcy19BtykaiuwvsdGZdl9kKrTwWkCc6uwX3GxgQPmv1gGUot9Kzw8gacuGgrY79AF7vRhIkmUbTwxkMjAe43i86SovQ6t06+rMSOK7yquxtzQN7qyN78ry1R9jHNujY70Gu5awuOuLsOMrLoehpH0bir7fUDgHJuhocKFDTbnvc5a1cNwTam+9pmVFOcdmSx0Tm9FmrRQUDYo8g0gbAHFsEe18N4BzXqgCgAEH5JhLmdMwLgP5qCLD-fYeRx54wUMoZQShcgjScJ+HkAhUAQDgMIG4bxJYygALRSFBAw7AGwNhshUI4EMUJ3qLRwAQYg85aA0PDh5PU6pMYFVULIHQFhwR+jZErHUpRViGicBnPmfgAhBEoDQCgwjt7zDVB-fCKh1Q6k2H6WQStpCjlyE4AM1QPor2rPo0ucRD57HBA9JgnJwxrAcAtTOP45w6P-KuWA64txNlcUg+Izh8y4PhNUJYc9XwPiyN5fBBDDQvW2PIfS2JDLUSCLrfO6IYkDwQGOV2QU8paQUmqFUjJtDYByOyNhBpsbODIg1UpLEKlunVBk-Uw4pB2DwYaZwoIATsxcNIIBqj0j4I+stQ6311pgDMkLcp8FaFIQBE+AqAJDRu1ZLkJp8Rp7YFZCsdkY4CrhjIjrTZm0ym9AGTKRu2BCpAOkNUcEDgnasy8ZsNYUirz6nSD7esOdSB9JcbskR-V9Ts3zCWTQUhAx4ykTXJuLDsWvVKDkMi-DSAAHkH7UA+UhPQCRvkmM0HjTp6TigFT1PCLJVQkiL3QJxZeP0Xl-QRbDAxZg8auyhK+eZaE0m3XwSwksCQKiVHRhAyGUDhbUrLpoZIqt1RvWLE4UEhU5AVHzOjA5pxukeDcEAA */
    context: gameContext || createNewGameContext(),
    id: "Coup",
    initial: "Game Start",
    states: {
      "Game Start": {
        always: {
          target: "Round Start",
        },
        entry: {
          type: "updateGameContext",
        },
      },

      "Round Start": {
        always: {
          target: "Action Phase",
        },
        entry: [
          {
            type: "updateCurrentRoundInitialPlayerTurn",
            params: ({context} : {context: GameContext}) => ({ 

            })
          },
          {
            type: "updateCurrentRound",
          },
          {
            type: "updateAvailableActionsForCurrentPlayer",
          },
          {
            type: "disableActionsForAllOpposingPlayers",
          },
        ],
      },

      "Action Phase": {
        on: {
          Income: {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Coup: {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "Foreign Aid": {
            target: "Foreign Aid Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Tax: {
            target: "Tax Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Assassination: {
            target: "Assassination Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Steal: {
            target: "Steal Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Exchange: {
            target: "Exchange Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Play Stack Resolving": {
        on: {
          Winner: {
            target: "Game Over",
          },
          "No Winner": {
            target: "Round Start",
          },
        },
        entry: {
          type: "computeResultsOfRound",
        },
        exit: {
          type: "resetPlayStack",
        },
      },

      "Foreign Aid Rebuttal Phase": {
        on: {
          "No Counter Action or Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "Block Foreign Aid": {
            target: "Counter Action Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Tax Rebuttal Phase": {
        on: {
          Challenge: {
            target: "Challenge Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "No Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Assassination Rebuttal Phase": {
        on: {
          "Block Assassination": {
            target: "Counter Action Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "No Counter Action or Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Steal Rebuttal Phase": {
        on: {
          "Block Steal": {
            target: "Counter Action Rebuttal Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          Challenge: {
            target: "Challenge Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "No Counter Action or Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Exchange Rebuttal Phase": {
        on: {
          Challenge: {
            target: "Challenge Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "No Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Game Over": {
        type: "final",
      },

      "Counter Action Rebuttal Phase": {
        on: {
          Challenge: {
            target: "Challenge Phase",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "No Challenge": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      },

      "Challenge Phase": {
        on: {
          Reveal: {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
          "Not Reveal": {
            target: "Play Stack Resolving",
            actions: {
              type: "pushEventToPlayStack",
            },
          },
        },
      }
    },
  });

  return machine;
};

export type GameEvent =
  | { type: "Tax"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Coup"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Steal"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Income"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Reveal"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Winner"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Exchange"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Challenge"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "No Winner"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Not Reveal"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Block Steal"; targetedPlayer: number; initiatingPlayer: number }
  | {
      type: "Foreign Aid";
      targetedPlayer: number;
      initiatingPlayer: number;
    }
  | { type: "No Challenge"; targetedPlayer: number; initiatingPlayer: number }
  | { type: "Assassination"; targetedPlayer: number; initiatingPlayer: number }
  | {
      type: "Block Foreign Aid";
      targetedPlayer: number;
      initiatingPlayer: number;
    }
  | {
      type: "Block Assassination";
      targetedPlayer: number;
      initiatingPlayer: number;
    }
  | {
      type: "No Counter Action or Challenge";
      targetedPlayer: number;
      initiatingPlayer: number;
    };
