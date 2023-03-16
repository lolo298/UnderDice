import { EventListener } from "three";
import { EventCreator } from "types";

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
export let lastTimeout: number;

export async function writeText(phrase: string) {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
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
declare var phrases: string[];
export function selectOption(target: HTMLImageElement | number[]) {
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  const menu = document.querySelector("#menu") as HTMLDivElement;
  let p = document.createElement("p");
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
      terrain.innerHTML = "";
      terrain.appendChild(p);
      writeText(phrases[randomNumber(phrases.length - 1)]);
      break;
    }
    // Act
    case "act": {
      terrain.innerHTML = "";
      terrain.appendChild(p);
      writeText("* You can't do that yet.");
      break;
    }
    // Item
    case "item": {
      terrain.innerHTML = "";
      terrain.appendChild(p);
      writeText("* You can't do that yet.");
      break;
    }
    // Mercy
    case "mercy": {
      terrain.innerHTML = "";
      terrain.appendChild(p);
      writeText("* You can't do that yet.");
      break;
    }
  }
}
