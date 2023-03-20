declare module "types" {
  export type EventCreator = (
    type: keyof HTMLElementEventMap,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
    target?: CSSselector
  ) => void;
  export type CSSselector = keyof HTMLElementTagNameMap | `.${string}` | `#${string}`;
  export type CANNONEvent = {
    type: "sleepy" | "sleep";
    target: CANNON.Body;
  };
  export interface Window {
    GameInstance?: Game;
  }
  declare global {
    var GameInstance: Game;
    var phrases: string[];
  }
  export type gameState = "attack" | "defend" | "idle" | "lose" | "win";
  export interface Game {
    state: gameState;
    attack(damage: number): void;
    defend(damage: number): void;
  }
}
