declare module "types" {
  export type EventCreator = (
    type: keyof HTMLElementEventMap,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
    target?: CSSselector
  ) => void;
  export type CSSselector = keyof HTMLElementTagNameMap | `.${string}` | `#${string}`;
  import CANNON from "cannon-es";
  export type CANNONEvent = {
    type: "sleepy" | "sleep";
    target: CANNON.Body;
  };
  export interface Window {
    GameInstance?: Game;
  }
   global {
    let GameInstance: Game;
    let phrases: string[];
    let lastTimeout: number;
  }
  export type gameState = "attack" | "defend" | "idle" | "lose" | "win";
  export interface Game {
    state: gameState;
    attack(damage: number): void;
    defend(damage: number): void;
    toGameOver(): void;
    toWin(): Promise<void>;
    getCharaLife(): number;
    getCharaLifeMax(): number;
    getSansLife(): number;
    getSansLifeMax(): number;
    spawnBlaster(soul: HTMLImageElement, damage: number): Promise<void>;
    sounds: Sounds;
  }

  export interface Sounds {
    musique: HTMLAudioElement;
    blasterSpawn: HTMLAudioElement;
    blasterHit: HTMLAudioElement;
    damage: HTMLAudioElement;
    type: HTMLAudioElement;
    slice: HTMLAudioElement;
    menu: HTMLAudioElement;
  }

  export interface AudioWriter {
    url: string;
    settings: AudioWriterSettings;
  }
  interface AudioWriterSettings {
    [key: string]: any;
    name: string;
    volume?: number;
    loop?: boolean;
    playbackRate?: number;
  }
}

declare interface HTMLAudioElement {
  [key: string]: any;
}

declare global {
  interface Window {
    GameInstance: Game;
  }
}