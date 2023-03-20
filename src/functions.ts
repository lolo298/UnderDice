import { EventCreator } from "types";
import throwDice from "./Dices";

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
export let lastTimeout: number;

export async function writeText(phrase: string) {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  terrain.innerHTML = "";
  let p = document.createElement("p");
  terrain.appendChild(p);
  if (lastTimeout) clearTimeout(lastTimeout);
  for (let letter of phrase) {
    p.innerHTML += letter;
    await new Promise((r) => (lastTimeout = setTimeout(r, 50)));
  }
}

export const newEvent: EventCreator = (type, callback, target) => {
  if (target) {
    const element = document.querySelector(target) as HTMLElement;
    element.addEventListener(type, callback);
  } else {
    window.addEventListener(type, callback);
  }
};

export const removeEvent: EventCreator = (type, callback, target) => {
  if (target) {
    const element = document.querySelector(target) as HTMLElement;
    element.removeEventListener(type, callback);
  } else {
    window.removeEventListener(type, callback);
  }
};

export const randomNumber = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
export function selectOption(target: HTMLImageElement | number[]) {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  let value = "";
  if (target instanceof HTMLImageElement) {
    value = target.id;
  }
  if (target instanceof Array) {
    value = menu.children[target.indexOf(1)].id;
  }
  switch (value) {
    // Fight
    case "fight": {
      toBattle();
      // terrain.innerHTML = "";
      // terrain.appendChild(p);
      // writeText(phrases[randomNumber(phrases.length - 1)]);
      break;
    }
    // Act
    case "act": {
      writeText("* You can't do that yet.");
      break;
    }
    // Item
    case "item": {
      writeText("* You can't do that yet.");
      break;
    }
    // Mercy
    case "mercy": {
      writeText("* You can't do that yet.");
      break;
    }
  }
}

export async function toBattle() {
  GameInstance.state = "attack";
  const battleEvent = createCustomEvent("toBattle");
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  const gameWidth = getComputedStyle(document.documentElement).getPropertyValue("--game-width");
  terrain.innerHTML = "";
  const animation = terrain.animate([{ width: gameWidth }, { width: "40%" }], {
    duration: 500,
    fill: "forwards",
    easing: "ease-in-out"
  });
  await animation.finished;
  throwDice();
  document.dispatchEvent(battleEvent);
}

export function toMenu() {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  terrain.style.width = "var(--game-width)";
  writeText(phrases[randomNumber(phrases.length - 1)]);
}

export function createCustomEvent(eventName: string) {
  const event = new Event(eventName);
  return event;
}
