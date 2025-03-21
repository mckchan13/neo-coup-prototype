export const characterCardNames = [
  "Duke",
  "Assassin",
  "Captain",
  "Contessa",
  "Ambassador",
] as const;

export const generalActionNames = ["ForeignAid", "Income", "Coup"] as const;

export const characterActionNames = [
  "Tax",
  "Steal",
  "Assassination",
  "Exchange",
] as const;

export const counterActionNames = [
  "BlockForeignAid",
  "BlockSteal",
  "BlockAssassination",
] as const;

export const revealActionNames = ["Reveal", "NotReveal"] as const;

export const challengeActionNames = ["Challenge"] as const;

export const actionCategory = [
  "GeneralAction",
  "CharacterAction",
  "CounterAction",
  "ChallengeAction",
  "RevealAction",
] as const;

export type StringListExtractor<T extends readonly string[]> = T[number];

export type CoupCharacterActionNames = StringListExtractor<
  typeof characterCardNames
>;

export type ActionCategory = StringListExtractor<typeof actionCategory>;

export type AllActionNames =
  | GeneralActionNames
  | CounterActionNames
  | ChallengeActionNames
  | RevealActionNames;

export type GeneralActionNames = Uncapitalize<
  StringListExtractor<typeof generalActionNames>
>;

export type CharacterActionNames = Uncapitalize<
  StringListExtractor<typeof characterActionNames>
>;

export type CounterActionNames = Uncapitalize<
  StringListExtractor<typeof counterActionNames>
>;

export type ChallengeActionNames = Uncapitalize<
  StringListExtractor<typeof challengeActionNames>
>;

export type RevealActionNames = Uncapitalize<
  StringListExtractor<typeof revealActionNames>
>;

export type Card<
  T extends CoupCharacterActionNames = CoupCharacterActionNames
> = {
  name: T;
  cost: number;
  heldBy: Player["id"] | "Deck";
  isRevealed: boolean;
};

export type AvailableActions = {
  generalAction: Record<GeneralActionNames, boolean>;
  characterAction: Record<CharacterActionNames, boolean>;
  counterAction: Record<CounterActionNames, boolean>;
  challengeAction: Record<ChallengeActionNames, boolean>;
  revealAction: Record<RevealActionNames, boolean>;
};

export type Player = {
  name: string;
  id: number;
  coins: number;
  hand: Card[];
  availableActions: AvailableActions;
};

export type TPlayAction<T extends AllActionNames = AllActionNames> = {
  actionName: T;
  actionCategory: ActionCategory;
  cost: number;
  playerInitiator: Player["id"];
  playerTargetedByAction: Player["id"];
  successEffects: {
    playerInitiator: {
      coins: number;
      influence: number;
    };
    playerTargetedByAction: {
      coins: number;
      influence: number;
    };
  };
  failEffects: {
    playerInitiator: {
      coins: number;
      influence: number;
    };
    playerTargetedByAction: {
      coins: number;
      influence: number;
    };
  };
};

export function createPlayer(name: string, id: number): Player {
  return {
    name,
    id,
    coins: 2,
    hand: [],
    availableActions: {
      generalAction: {
        income: false,
        foreignAid: false,
        coup: false,
      },
      characterAction: {
        assassination: false,
        exchange: false,
        steal: false,
        tax: false,
      },
      counterAction: {
        blockAssassination: false,
        blockForeignAid: false,
        blockSteal: false,
      },
      revealAction: {
        reveal: false,
        notReveal: false,
      },
      challengeAction: {
        challenge: false,
      },
    },
  };
}

export const effectNames = [
  "TakeCoins",
  "PayCoins",
  "LoseInfluence",
  "SwapCards",
  "StealCoins",
] as const;

export type TakeCoins = (initiator: Player["id"], amount: number) => void;
export type PayCoins = (initiator: Player["id"], amount: number) => void;
export type LoseInfluence = (target: Player["id"]) => void;
export type SwapCards = (initiator: Player["id"]) => void;
export type StealCoins = (
  initiator: Player["id"],
  target: Player["id"],
  amount: number
) => void;

export type EffectFunctions =
  | TakeCoins
  | PayCoins
  | LoseInfluence
  | SwapCards
  | StealCoins;

export type EffectFunctionArguments<T extends EffectFunctions> = Parameters<T>;

export type TakeCoinsArgs = EffectFunctionArguments<TakeCoins>;

export type PayCoinsArgs = EffectFunctionArguments<PayCoins>;

export type LoseInfluenceArgs = EffectFunctionArguments<LoseInfluence>;

export type SwapCardsArgs = EffectFunctionArguments<SwapCards>;

export type StealCoinsArgs = EffectFunctionArguments<StealCoins>;
