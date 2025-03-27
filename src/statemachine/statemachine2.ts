import { assign, setup } from "xstate";
import { createGameContext } from "../MockServer";

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
};

export const machine = setup({
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
    updateCurrentRound: ({ context, event }, pararms) => {},
    updateAvailableActionsForCurrentPlayer: ({ context, event }, params) => {},
    disableActionsForAllOpposingPlayers: ({ context, event }, params) => {},
    computeResultsOfRound: ({ context, event }, params) => {},
    pushEventToPlayStack: ({ context, event }, params) => {},
  } as TActionsObjectType,
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGED2BXADgAgBQGNVMBPASgDoBxAQwFsxsBlAF2oCdmBiAbQAYBdRKEypYAS2ZjUAOyEgAHogBMARhUB2cgA4AbEp0BWACwGDATiM6VOgDQhiiA1qPkzvJQYDMnreoN6VMwBfILs0LDxCEgoAJQxpCCZWDh4BORFxSRk5RQQVSwNXPw8jP3UzYyU7BzylX3J1XhUlCs91JW91ELCMHAIiMnIAQXws6WwABQALalgwTgBJaUJ6PkEkEAyJKVkN3KV9chNPZqbTTv9qxC0VI7N7rWdeJq1vLW6QcL6owZGxyZmc04XzW6VE22ye2Uh2OpxU5zal3siBUJ1c9zMWl4WJ0FQM+Q+X0iAwofx2ANm8wAYqg2GAxFBxkMxBBQRstmMctCdEcvHCEX5bMiEAYWtpLJ4OkYlM91J4DITesTosNRuTppTOAAVajyNnCcGcqEIA482Ey+FeRFCmotHmvby8IxnTFGAmhT5K-oqskyClAoawWCzcTSahjfWbQ07LkmmF8i0CpE1MzqLTkHwVPS8HS+OWeRURb2-NV+jVAlhgagAG0jHJjxtNvJOiatgquCHUanIOfyWIsWM8OiMhe+JNV-3L8wAovJ8DNpDA69HIaB9vGW2c28mURolBmdFZrLx1O1nAqPUTixQJtXqMQktR8ABrbAxOCoasANzEi84AHVf2kMA2GXTIGzXaFeE8bQVCxcx3HKMx5Q7NR2m0Q9AiMG5j1MUdlUGW970fF83w-b9fygTgADlUGwQDpGA0C0nZFddkgk1AluZx4RMJQ5RUE9UPcHlcVKfQ6gMbEnHw69yBpOkGSZFkyIAI3QZhWGrf15lo7BwmkZgQOwX1xlpfSZmraswEXMAwIhdiFEQRpNDqNRrBuMwlGlDsjGdDNeExQwrFPKVZJ+CgFPpRkTJU991M0msdM4AAhatUFIqKlNi1kWINcDVyczsT3INy1FzQJvKqYUvB5CTMUeVQZQOcLxx1eQ1I0rTkuQSzrNs+yjQ4-J-OzCUcx0TwvOqmpPCdchhxC-ih1RZCdFalV2s6xLtKnGi6N6mt+qXPKowKxzclRU9XD0UU-KcIcvNQ+4jl8Zo-CaQKOiUDbfiDENf3Dcl4q6pK9rSjLX0DYMg0BiNTvrQrchc0qcI8yqfOFR5eFKt1rECfxhxzX7SX+2Gw3+EGduSvSDKMtgTNLMyGcOqybJO9Z8oc2MUbK9GvMxlNnG0HMDnUSx7ncFQSfISskqp7rwfS0i5drBG2J5kq+YqgWZuc7wGmxiUJS0e4ZdV7bFcBeZWeOuz1fOzXXLRnWqo7Sb91UI9mssftzaM+WwASq3NVp+J6cZ-5zNt9n7c5s7ueNXmXc8t3hTTFw6kHXw+Ssd5Ly9CLyFnedqFsy2wet4E+tjwaIKKvt0y0cwZWb6wCnUVDUTqm4dHFtvMxlkuFxgCvdqr2ma4Gh3E+Gu0FudfE3Dm5DjC7tNDf4m5Sh4yUZbp4zTLHnqp45sFHeNZozFExfAmgwL5SMDtihuqxsQOHFc338PD6Z4+9snkdWuM8hoN3nkTJe99V5Pyxn4Te5RDzDl0Nffep8GB7XfF+Ksat46IwuiiYc+5BJeQMF2Nok1SHP1MD2SUWInRWGwkOVBQDy4ANQMwMiWCax1yRgQ6U5BiEeDIeoChnd07zS8HUbEvBjBdg0CED00hUAQDgHIK8EVz6zyKgAWhtIgXRPZnhNH4ieN0p4bgyxoPQR8HBNGgP2E6QovYfBqElBoXMvkSqBRkX4NC8IrAyziOgBINjmB2Prg4kqFRShwX0EY08z8-LkHxJYL6J5TavBlkfKc4TeEIEFvrFwXlcTykMF2byXQC5FiLkRB8LAnyvnfLAT8P5Fy5PwXkXQ+5nBDjmicKw3ku5wQaDoZ4qhBLOiwjLLKMVmSJAVpXSk7TYx+TMCM0wlRRkyh8B2c4PYzyPBuM4fQwQqljk2rqf+1tlnGkYUcPQLiKji1THrBAJwcbtDTEOZ4EpVBZLJqGIGfoFnjyWaxC+HEjA+AzOYSUc06gnExMJJoC18b8UsOUvu-tsFXLBVzexiBsKFDMBoElzpr5qGxM-TwmcjaTRNmbM5BEKDDzLqPEFOkbmQtNqVXEWh+L3CsLiAwXd6heFMUY3MLUmVySsQwAA8lgtgXKiqqF0EUXiMjRRWFQnUIp+J9BzTUJiH6Mqi4HwZkfDlOTwVaMuk0NZjQWivD7I0YcHZkEYScI0Lwzo8zMLZqw65tqCV5EsDyJ1qYxJTQ8IktZahvVQrmk6hRQQgA */
  context: createGameContext(""),
  id: "Coup (copy)",
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
        },
        Challenge: {
          target: "Challenge Phase",
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
        },
        "No Challenge": {
          target: "Play Stack Resolving",
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
        },
        "No Challenge": {
          target: "Play Stack Resolving",
        },
      },
    },
    "Challenge Phase": {
      on: {
        Reveal: {
          target: "Play Stack Resolving",
        },
        "Not Reveal": {
          target: "Play Stack Resolving",
        },
      },
    },
  },
});

export type GameContext = {
  players: unknown[];
  started: boolean;
  playStack: unknown[];
  sessionId: string;
  intialized: boolean;
  currentRound: number;
  currentAction: string;
  currentPlayer: number;
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
