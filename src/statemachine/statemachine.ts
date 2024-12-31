import { assign, createActor, setup, TransitionSnapshot } from "xstate";
import { defaultContext } from "../context";
import { GameMaster, CoupCharacterActionNames } from "../GameMaster";
import { CoupPlayerEvent } from "../components";

const gm = new GameMaster();
gm.shuffle();
console.log("*** deck ***", gm.cardDeck);

export function createUUID() {
  return self.crypto.randomUUID();
}

export function resetDatabase() {
  sessionStorage.removeItem("database");
}

export type UUID = ReturnType<typeof createUUID>;

export type SessionDatabaseItem = {
  initialContext: CoupGameContext;
  persistedState?: TransitionSnapshot<CoupGameContext>;
};

export type SessionDatabase = Record<UUID, SessionDatabaseItem>;

export type Result<T = unknown> = [Error, null] | [null, T];

export type CoupGameContext = {
  sessionId: string;
  currentRound: number;
  currentPlayer: number;
  numberOfPlayers: number;
  players: any[];
  initialized: boolean;
  started: boolean;
};

export type CoupPlayers = {
  id: number;
  coins: number;
  name: string;
  deck: any[];
  actionsEnabled: {
    generalActions: {
      income: boolean;
      foreignAid: boolean;
      coup: boolean;
    };
    characterActions: {
      duke: boolean;
      assassin: boolean;
      captain: boolean;
      ambassador: boolean;
    };
    counterActions: {
      duke: boolean;
      contessa: boolean;
      ambassador: boolean;
      captain: boolean;
    };
    special: {
      challenge: boolean;
    };
  };
};

function generateStateMachine(context?: CoupGameContext) {
  if (context === undefined) {
    throw new Error("No context provided");
  }

  const contextFields: (keyof typeof context)[] = [
    "sessionId",
    "numberOfPlayers",
    "players",
    "initialized",
    "started",
  ];

  const isValidContext = contextFields.every(
    (key) => context[key] !== undefined || context[key] !== null
  );

  if (!isValidContext) {
    throw new Error("Invalid context");
  }

  const machine = setup({
    types: {
      context: {} as CoupGameContext,
      events: {} as CoupPlayerEvent,
    },
    actions: {
      updateCurrentPlayer: assign({
        currentPlayer: ({ context, event }, params) =>
          (context.currentPlayer + 1) % context.numberOfPlayers,
      }),
      updateCurrentRound: assign({
        currentRound: ({ context, event }, params) => context.currentRound + 1,
      }),
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGED2BXADgOgOIEMBbMAAgGUAXfAJwoGIBtABgF1FRNVYBLC71AHbsQAD0QBOJuOwBGGeIAcAZgBsAJiZMArAHYlAFgA0IAJ6I1Khdk02mOhTLUz9ugL6vjaLNgBKGARDkVLSMrMKcPHyCwmIIktJyiqoa2npGpogO2Fq2+kwKOTr6au6eGDgACtSohJgUJBUANvgmYNQkAGao7QCCAMZRAnTIABY0+ANtJP2DzGxIIBG8-EILsWo60irbOtpa+pv74irGZggp2Do5mgqpiToypSBeldW19U0tU129AyvD5Tm4S4y2ia3Mm2w2xUuy0+0O+mOp0QSg01hsjiYanEMhUWhKHme5Wwo3Gk1+gwazVaEFC8w4IMGMUQMLUl2u+NR4i0OK0yPOWOwamuTCUUiUOJUSieL18-kCAFEApA6cDIitmXEpLJ5Mp1JpdAZ+RppCKsTopVoxUotO5CQJUBA4MIXmrQatQLEALQnDIIH0y4kEYhBGgUN1M8EIHSQpjqK0KcTWxFqY0w9E2XT6bMyBSB7x+dABUO0CMaqMyGzYVT6dQHLQqJguHT83M6bCI8SKBQaOHiNTSwmyqo1OpUr7tH7TP5ghnq2eiRDFfkKKwKK43OEWRQw-M4UnUCYUKYzFbjmllhexFwqWRitQuCWdge+s4aGRCkW3XT3PdyouKsqECXh6i7RlK2BdvoCh5KuORSi2foaFYZoxhYeiqHmdpAA */
    context: {
      ...context,
    },
    id: "Coup",
    initial: "Game Start",
    states: {
      "Game Start": {
        always: {
          target: "Round Start",
        },
      },
      "Round Start": {
        always: {
          target: "Prompt Player for Action",
        },
        entry: [
          {
            type: "updateCurrentPlayer",
          },
          {
            type: "updateCurrentRound",
          },
        ],
      },
      "Prompt Player for Action": {
        on: {
          "Character Action": {
            target: "Character Action Played",
          },
          Coup: {
            target: "Round Ended",
          },
        },
      },
      "Character Action Played": {
        always: {
          target: "Round Ended",
        },
      },
      "Round Ended": {
        always: {
          target: "Round Start",
        },
      },
    },
  });

  return machine;
}

export function createSession() {
  const sessionId = self.crypto.randomUUID();

  const db = JSON.parse(
    sessionStorage.getItem("database") || JSON.stringify({})
  ) as SessionDatabase;

  db[sessionId] = {
    initialContext: { ...defaultContext, sessionId, initialized: true },
  };

  sessionStorage.setItem("database", JSON.stringify(db));

  return sessionId;
}

export function startGame(
  context: Parameters<typeof generateStateMachine>[number],
  sessionId: string
) {
  if (context === undefined) {
    throw new Error("No context was passed");
  }

  const dbSessionStorage = sessionStorage.getItem("database");

  if (dbSessionStorage === null) {
    throw new Error("Unable to retrieve database");
  }

  const db = JSON.parse(dbSessionStorage) as SessionDatabase;

  if (!(sessionId in db)) {
    throw new Error("Session not found");
  }

  const sessionDatabaseItem = db[sessionId as UUID];

  const { initialContext } = sessionDatabaseItem;

  const updatedInitialContext: CoupGameContext = {
    ...initialContext,
    ...context,
  };

  const machine = generateStateMachine(updatedInitialContext);
  const actor = createActor(machine);

  const subscription = actor.subscribe({
    next(snapshot) {
      console.log(snapshot);
    },
  });

  actor.start();

  const persistedState =
    actor.getPersistedSnapshot() as TransitionSnapshot<CoupGameContext>;

  db[sessionId as UUID] = {
    initialContext: updatedInitialContext,
    persistedState,
  };

  console.log("Saving initial game state to database item", db);

  sessionStorage.setItem("database", JSON.stringify(db));

  actor.stop();

  subscription.unsubscribe();

  return persistedState;
}

export function sendEvent(
  event: CoupPlayerEvent,
  sessionId: UUID
): Result<TransitionSnapshot<CoupGameContext>> {
  try {
    const dbSessionStorage = sessionStorage.getItem("database");

    if (dbSessionStorage === null) {
      throw new Error("Game state not found");
    }

    const db = JSON.parse(dbSessionStorage) as SessionDatabase;

    if (!(sessionId in db)) {
      throw new Error("Session not found");
    }

    const sessionDatabaseItem = db[sessionId];

    const { persistedState: snapshot, initialContext } = sessionDatabaseItem;

    if (snapshot === undefined) {
      throw new Error("Snapshot not found");
    }

    console.log("snapshot found", snapshot);

    const machine = generateStateMachine({
      ...initialContext,
    });

    // restore the state
    const actor = createActor(machine, { snapshot });

    actor.start();

    const subscription = actor.subscribe({
      next(snapshot) {
        console.log("on next", snapshot);
      },
    });

    actor.send(event);

    const updatedState =
      actor.getPersistedSnapshot() as TransitionSnapshot<CoupGameContext>;

    db[sessionId] = {
      ...db[sessionId],
      persistedState: updatedState,
    };

    sessionStorage.setItem("database", JSON.stringify(db));

    actor.stop();

    subscription.unsubscribe();

    return [null, updatedState];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return [error, null];
    }

    return [new Error("Exception Occurred"), null];
  }
}
