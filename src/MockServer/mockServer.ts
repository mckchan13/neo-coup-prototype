import type { GameEvent, GameContext } from "../statemachine/statemachine2";

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

  static listen(eventType: string,
    eventListener: (event: Event) => void
  ) {
    document.body.addEventListener(eventType, eventListener);

    const cleanUpFunction = () => {
      document.body.removeEventListener(
        eventType,
        eventListener
      );
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

    console.log(request);

    return {
      sessionId: self.crypto.randomUUID(),
      gameContext: createGameContext(""),
    };
  },

  processEvent: (request: { sessionId: SessionId; event: GameEvent }) => {
    // send the event to the state machine
    const { sessionId, event } = request;
    console.log(sessionId, event);
    return {
      ...createGameSessionAndContext(),
    };
  },
};

export function createGameContext(
  sessionId: string,
  overrides?: Partial<GameContext>
): GameContext {
  const defaultGameContext: GameContext = {
    players: [],
    started: false,
    playStack: [],
    sessionId,
    intialized: true,
    currentRound: -1,
    currentAction: "",
    currentPlayer: 0,
  };

  return {
    ...defaultGameContext,
    ...(overrides ? overrides : {}),
  };
}

function createGameSessionAndContext() {
  const sessionId = createSessionId();

  const initialGameContext = createGameContext(sessionId);

  setGameContextBySessionId("coupDatabase", sessionId, initialGameContext);

  return { sessionId, gameContext: initialGameContext };
}

function getDatabase(
  databaseName: string
): Record<SessionId, { gameContext: GameContext }> {
  const database = JSON.parse(
    sessionStorage.getItem(databaseName) || "{}"
  ) as Record<SessionId, { gameContext: GameContext }>;

  return database;
}

function getGameContextBySessionId(
  databaseName: string,
  sessionId: SessionId
): GameContext {
  const database = getDatabase(databaseName);
  return database[sessionId]?.gameContext;
}

function setGameContextBySessionId(
  databaseName: string,
  sessionId: SessionId,
  gameContext: GameContext
): void {
  const database = getDatabase(databaseName);
  database[sessionId] = { gameContext: gameContext };
  sessionStorage.setItem(databaseName, JSON.stringify(database));
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
