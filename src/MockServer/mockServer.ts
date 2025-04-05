import { createActor, Snapshot, TransitionSnapshot } from "xstate";
import {
  type GameEvent,
  type GameContext,
  startStateMachine,
} from "../statemachine/statemachine2";
import { parseError } from "../utils";

export class MockHttpRequest<T extends string = "mockHttpRequest"> {
  constructor(public type: T, public detail: Record<any, any>) {
    this.type = type;
    this.detail = detail;
  }

  private buildCustomEvent(): CustomEvent {
    return new CustomEvent(this.type, this.detail);
  }

  public dispatch(): void {
    document.body.dispatchEvent(this.buildCustomEvent());
  }
}

export class MockNetwork {
  static sendRequest(
    route: keyof TServerRoutes,
    request: Parameters<TServerRoutes[keyof TServerRoutes]>[number]
  ) {
    new MockHttpRequest("mockHttpRequest", {
      route,
      request,
      message: "Hello world!",
    }).dispatch();
  }

  static listen(eventType: string, eventListener: (event: Event) => void) {
    document.body.addEventListener(eventType, eventListener);

    const cleanUpFunction = () => {
      document.body.removeEventListener(eventType, eventListener);
    };

    return {
      cleanUpFunction,
    };
  }
}

export function sendRequest(
  route: keyof TServerRoutes,
  request: Parameters<TServerRoutes[keyof TServerRoutes]>[number]
) {
  new MockHttpRequest("mockHttpRequest", {
    route,
    request,
    message: "Hello world!",
  }).dispatch();
}

export function sendRequestOriginalImplementation(
  route: keyof TServerRoutes,
  request: Parameters<TServerRoutes[keyof TServerRoutes]>[number]
) {
  // Simulates receiving the event then routing it
  let response: ReturnType<TServerRoutes[keyof TServerRoutes]>;

  switch (route) {
    case "initializeGame": {
      const handler = mockServerRoutes.initializeGame;
      response = handler(request as { playerNames: string[] });
      break;
    }
    case "processEvent": {
      const handler = mockServerRoutes.processEvent;
      response = handler(request as { sessionId: SessionId; event: GameEvent });
      break;
    }
  }

  return response;
}

export type MockServerRouteHandler<TRequest = any, TResponse = any> = (
  request: TRequest
) => TResponse;

export type TServerRoutes = {
  initializeGame: MockServerRouteHandler<
    { playerNames: string[] },
    { sessionId: SessionId; gameContext: GameContext }
  >;
  processEvent: MockServerRouteHandler<
    { sessionId: SessionId; event: GameEvent },
    { sessionId: SessionId; gameContext: GameContext }
  >;
};

const mockServerRoutes: TServerRoutes = {
  initializeGame: (request: { playerNames: string[] }) => {
    function assertRequestIsValid(request: {
      playerNames: string[];
    }): asserts request is { playerNames: string[] } {
      const playerNamesIsNotArray = !Array.isArray(request.playerNames);
      const arrayValuesAreNotStrings = !!request.playerNames?.some(
        (value) => typeof value !== "string"
      );

      if (playerNamesIsNotArray || arrayValuesAreNotStrings) {
        throw new Error("Invalid request for initialize game");
      }
    }

    assertRequestIsValid(request);

    const { sessionId, gameContext } = createGameSessionAndContext();

    // save the initial game context to the database, where sessionId is
    // the key to the new gamecontext
    setGameContextBySessionId("coupDatabase", sessionId, {
      initialGameContext: gameContext,
      currentGameContext: gameContext,
    });

    // initialize the Game state machine and return updated state to user
    const machine = startStateMachine(gameContext);

    const actor = createActor(machine);

    const subscription = actor.subscribe({
      next: (snapshot) => console.log(snapshot),
      error: (err) => console.error(parseError(err)),
    });

    actor.start();

    const snapshot =
      actor.getPersistedSnapshot() as TransitionSnapshot<GameContext>;

    const currentGameContext = snapshot.context;

    setGameContextAndSnapshotBySessionId("coupDatabase", sessionId, {
      currentGameContext,
      snapshot,
    });

    subscription.unsubscribe();

    actor.stop();

    return {
      sessionId,
      gameContext: currentGameContext,
    };
  },

  processEvent: (request: { sessionId: SessionId; event: GameEvent }) => {
    // send the event to the state machine
    const { sessionId, event } = request;
    console.log(sessionId, event);

    const { updatedGameContext } = transitionStateMachineWithEvent(
      event,
      sessionId
    );
    
    return {
      sessionId,
      gameContext: updatedGameContext,
    };
  },
};

export function createNewGameContext(
  sessionId?: string,
  overrides?: Partial<GameContext>
): GameContext {
  const defaultGameContext: GameContext = {
    players: [],
    started: false,
    playStack: [],
    sessionId: sessionId || createSessionId(),
    intialized: true,
    currentRound: -1,
    currentAction: "",
    currentPlayer: 0,
    numberOfPlayers: 0,
  };

  return {
    ...defaultGameContext,
    ...(overrides ? overrides : {}),
  };
}

function createGameSessionAndContext() {
  const sessionId = createSessionId();

  const initialGameContext = createNewGameContext(sessionId);

  // setGameContextBySessionId("coupDatabase", sessionId, initialGameContext);

  return { sessionId, gameContext: initialGameContext };
}

function getDatabase(databaseName: string): CoupDatabase {
  const database = JSON.parse(
    sessionStorage.getItem(databaseName) || "{}"
  ) as CoupDatabase;

  return database;
}

function getGameContextAndSnapshotBySessionId(
  databaseName: string,
  sessionId: SessionId
): {
  initialGameContext: GameContext | undefined;
  currentGameContext: GameContext | undefined;
  snapshot: TransitionSnapshot<GameContext> | undefined;
} {
  const database = getDatabase(databaseName);
  const { initialGameContext, currentGameContext, snapshot } =
    database[sessionId];

  return {
    initialGameContext,
    currentGameContext,
    snapshot,
  };
}

function setGameContextBySessionId(
  databaseName: string,
  sessionId: SessionId,
  updatedCoupDatabaseItem: CoupDatabaseItem
): void {
  const database = getDatabase(databaseName);
  if (sessionId in database) {
    const prevCoupDatabaseItem = database[sessionId];
    database[sessionId] = {
      ...prevCoupDatabaseItem,
      ...updatedCoupDatabaseItem,
    };
  } else {
    database[sessionId] = updatedCoupDatabaseItem;
  }

  sessionStorage.setItem(databaseName, JSON.stringify(database));
}

function setGameContextAndSnapshotBySessionId(
  databaseName: string,
  sessionId: SessionId,
  updatedGameContextAndSnapshot: Omit<CoupDatabaseItem, "initialGameContext">
): void {
  const database = getDatabase(databaseName);
  const { currentGameContext, snapshot } = updatedGameContextAndSnapshot;
  const prevCoupDatabaseItem = database[sessionId];
  database[sessionId] = {
    ...prevCoupDatabaseItem,
    currentGameContext,
    snapshot,
  };

  sessionStorage.setItem(databaseName, JSON.stringify(database));
}

function transitionStateMachineWithEvent(
  event: GameEvent,
  sessionId: SessionId
): {
  updatedGameContext: GameContext;
} {
  const { initialGameContext, snapshot } = getGameContextAndSnapshotBySessionId(
    "coupDatabase",
    sessionId
  );

  const machine = startStateMachine(initialGameContext);

  const actor = createActor(machine, { snapshot });

  const subscription = actor.subscribe({
    next: (snapshot) => console.log(snapshot),
    error: (err) => console.error(parseError(err)),
  });

  actor.start();

  actor.send(event);

  const updatedSnapshot =
    actor.getPersistedSnapshot() as TransitionSnapshot<GameContext>;

  subscription.unsubscribe();

  const updatedGameContext = updatedSnapshot.context;

  setGameContextAndSnapshotBySessionId("coupDatabase", sessionId, {
    currentGameContext: updatedGameContext,
    snapshot,
  });

  return {
    updatedGameContext,
  };
}

function createSessionId() {
  return self.crypto.randomUUID();
}

export type SessionId = ReturnType<typeof createSessionId>;

export type AssertionFunction<T> = (value: T) => asserts value is T;

function assertsTypeOfValue<T>(
  valueToAssert: T,
  assertionCallback: AssertionFunction<T>
): void {
  assertionCallback(valueToAssert);
}

assertsTypeOfValue<string>("someString", (value) => {
  if (typeof value !== "string") {
    throw new Error("Not a string");
  }
});

export type CoupDatabaseItem = {
  initialGameContext: GameContext;
  currentGameContext?: GameContext;
  snapshot?: TransitionSnapshot<GameContext>;
};

export type CoupDatabase = Record<SessionId, CoupDatabaseItem>;
