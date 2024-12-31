export const coupCharacterCardNamesList = [
  "Duke",
  "Assassin",
  "Captain",
  "Contessa",
  "Ambassador",
] as const;

export type CoupCharacterActionNames = (typeof coupCharacterCardNamesList)[number];

export type CoupGameCard<T = CoupCharacterActionNames> = {
  name: T;
  cost: number;
};

export class GameMaster {
  public coupCardNames = coupCharacterCardNamesList;
  public deck: CoupGameCard[];

  constructor(public existingDeck?: CoupGameCard[]) {
    this.deck = this.buildDeck(this.existingDeck);
  }

  buildDeck(existingDeck?: CoupGameCard[]): CoupGameCard[] {
    if (existingDeck !== undefined) return existingDeck;

    return this.coupCardNames.flatMap((name) => {
      const card = {
        name: name as CoupCharacterActionNames,
        cost: 0,
      } satisfies CoupGameCard<CoupCharacterActionNames>;
      return [card, structuredClone(card), structuredClone(card)];
    });
  }

  insert(card: CoupGameCard) {
    this.deck.push(card);
  }

  deal(): CoupGameCard {
    if (this.deck.length === 0) {
      throw new Error("no card available");
    }

    return this.deck.pop() as CoupGameCard;
  }

  shuffle(): void {
    for (const idx in this.deck) {
      const randomInt = Math.floor(Math.random() * this.deck.length);
      if (randomInt !== parseInt(idx)) {
        const cardToSwap = this.deck[idx];
        this.deck[idx] = this.deck[randomInt];
        this.deck[randomInt] = cardToSwap;
      }
    }
  }

  get cardDeck(): CoupGameCard[] {
    return this.deck;
  }
}
