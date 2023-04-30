import "./style.css";
import "./fonts/stylesheet.css";
import Game from "./Game";
console.log("Hello World");
import { delay, writeText, newEvent, randomNumber, selectOption, removeEvent } from "./functions";
import { CSSselector } from "types";
globalThis.GameInstance = new Game();
globalThis.phrases = [
  "* You felt your sins crawling on your back.",
  "* You felt your sins crawling on your neck.",
  "* Your filled with determination",
  "* You feel like  your gonna have a bad time.",
  "* Reading this doesn't seem like the best use of your time.",
  "* Sans is preparing something.",
];

GameInstance.sounds.musique.play();
let phrases = globalThis.phrases;
let menuSelect = [1, 0, 0, 0];
// let timeoutRewrite: number;
await delay(1000);
// @ts-ignore
window["phrases"] = phrases;
writeText(phrases[randomNumber(phrases.length - 1)], "#terrain");

newEvent("keydown", handleKeyDown);
newEvent("mousemove", handleMouseMove, "#menu");
newEvent("click", handleClick, "#menu");

const menuEvents = ["keydown", "mouseMove", "click"];
const menuEventFunctions = [handleKeyDown, handleMouseMove, handleClick];
const menuEventTargets = ["#menu", "#menu", null];

function handleKeyDown(e: Event) {
  if (!(e instanceof KeyboardEvent)) return;
  if (GameInstance.state === "attack" || GameInstance.state === "defend") return;
  const menu = document.querySelector("#menu") as HTMLDivElement;
  // const terrain = document.querySelector("#terrain") as HTMLDivElement;
  // let p = document.createElement("p");
  switch (e.code) {
    case "ArrowLeft": {
      let id = menuSelect.indexOf(1);
      let selected = menu.children[id] as HTMLImageElement;
      let previous = menu.children[id - 1] as HTMLImageElement;
      if (id === 0) break;
      GameInstance.sounds.menu.play();
      menuSelect[id] = 0;
      menuSelect[id - 1] = 1;
      selected.classList.toggle("selected");
      previous.classList.toggle("selected");
      previous.src = previous.src.replace(
        previous.id.toUpperCase(),
        previous.id.toUpperCase() + "selected"
      );
      selected.src = selected.src.replace(
        selected.id.toUpperCase() + "selected",
        selected.id.toUpperCase()
      );
      break;
    }
    case "ArrowRight": {
      let id = menuSelect.indexOf(1);
      let selected = menu.children[id] as HTMLImageElement;
      let next = menu.children[id + 1] as HTMLImageElement;
      if (id === 3) break;
      GameInstance.sounds.menu.play();
      menuSelect[id] = 0;
      menuSelect[id + 1] = 1;
      selected.classList.toggle("selected");
      next.classList.toggle("selected");
      next.src = next.src.replace(next.id.toUpperCase(), next.id.toUpperCase() + "selected");
      selected.src = selected.src.replace(
        selected.id.toUpperCase() + "selected",
        selected.id.toUpperCase()
      );
      break;
    }
    case "NumpadEnter":
    case "Enter": {
      selectOption(menuSelect);
    }
  }
}

let lastTarget: HTMLImageElement;
function handleMouseMove(e: Event) {
  if (!(e instanceof MouseEvent)) return;
  const target = e.target;
  if (!(target instanceof HTMLImageElement)) {
    if (!lastTarget) return;
    lastTarget.src = lastTarget.src.replace(
      lastTarget.id.toUpperCase() + "selected",
      lastTarget.id.toUpperCase()
    );
    lastTarget.classList.remove("selected");
    return;
  }
  lastTarget = target;
  if (target.classList.contains("selected")) return;
  GameInstance.sounds.menu.play();
  let oldSelected = document.querySelector(".selected") as HTMLImageElement;
  if (oldSelected) {
    oldSelected.src = oldSelected.src.replace(
      oldSelected.id.toUpperCase() + "selected",
      oldSelected.id.toUpperCase()
    );
    oldSelected.classList.remove("selected");
  }
  target.src = target.src.replace(target.id.toUpperCase(), target.id.toUpperCase() + "selected");
  target.classList.add("selected");
  switch (target.id) {
    case "fight": {
      menuSelect = [1, 0, 0, 0];
      break;
    }
    case "act": {
      menuSelect = [0, 1, 0, 0];
      break;
    }
    case "item": {
      menuSelect = [0, 0, 1, 0];
      break;
    }
    case "mercy": {
      menuSelect = [0, 0, 0, 1];
      break;
    }
  }
}
function handleClick(e: Event) {
  if (!(e instanceof MouseEvent)) return;
  const target = e.target;
  if (!(target instanceof HTMLImageElement)) return;
  if (!["fight", "act", "item", "mercy"].includes(target.id)) return;
  selectOption(target);
}

function unlockMenu() {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  menu.style.pointerEvents = "auto";
  menuEvents.forEach((event, key) => {
    let eventName = event as keyof HTMLElementEventMap;
    newEvent(eventName, menuEventFunctions[key] as any, "#menu");
  });
}
function lockMenu() {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  menu.style.pointerEvents = "none";
  menuEvents.forEach((event, key) => {
    let eventName = event as keyof HTMLElementEventMap;
    let eventTarget = menuEventTargets[key] as CSSselector | null;
    if (eventTarget) {
      removeEvent(eventName, menuEventFunctions[key] as any, eventTarget);
    } else {
      removeEvent(eventName, menuEventFunctions[key] as any);
    }
  });

  const selected = document.querySelector(".selected");
  if (selected) {
    if (selected instanceof HTMLImageElement) {
      selected.classList.remove("selected");
      selected.src = selected.src.replace(
        selected.id.toUpperCase() + "selected",
        selected.id.toUpperCase()
      );
    }
  }
}

document.addEventListener("toBattle", lockMenu);
document.addEventListener("toMenu", unlockMenu);
