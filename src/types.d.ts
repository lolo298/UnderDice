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
  export interface Game {
    state: "attack" | "defend" | "idle";
    attack(damage: number): void;
    defend(damage: number): void;
  }
}
