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
    var lastTimeout: number;
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
    name: string;
    volume?: number;
    loop?: boolean;
    playbackRate?: number;
  }
}
