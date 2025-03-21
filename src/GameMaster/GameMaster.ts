import { Card } from "../types";
import { CoupCharacterActionNames } from "../types";
import { characterCardNames } from "../types";


export class GameMaster {
  public coupCardNames = characterCardNames;
  public deck: Card[];

  constructor(public existingDeck?: Card[]) {
    this.deck = this.buildDeck(this.existingDeck);
  }

  buildDeck(existingDeck?: Card[]): Card[] {
    if (existingDeck !== undefined) return existingDeck;

    return this.coupCardNames.flatMap((name) => {
      const card = {
        name: name as CoupCharacterActionNames,
        cost: 0,
        heldBy: "Deck",
        isRevealed: false,
      } satisfies Card<CoupCharacterActionNames>;
      return [card, structuredClone(card), structuredClone(card)];
    });
  }

  insert(card: Card) {
    this.deck.push(card);
  }

  deal(): Card {
    if (this.deck.length === 0) {
      throw new Error("no card available");
    }

    return this.deck.pop() as Card;
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

  get cardDeck(): Card[] {
    return this.deck;
  }
}
