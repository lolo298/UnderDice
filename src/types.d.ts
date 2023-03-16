declare module "types" {
  export type EventCreator = (
    type: keyof HTMLElementEventMap,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
    target?: CSSselector
  ) => void;
  export type CSSselector = keyof HTMLElementTagNameMap | `.${string}` | `#${string}`;
}
