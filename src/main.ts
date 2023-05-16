import "./style.css";
import "./fonts/stylesheet.css";
import Game from "./Game";
import {
  writeText,
  newEvent,
  randomNumber,
  selectOption,
  removeEvent,
} from "./functions";
import { CSSselector } from "types";
//load the game
const GameInstance = new Game();
window.GameInstance = GameInstance;
const phrases = [
  "* You felt your sins crawling on your back.",
  "* You felt your sins crawling on your neck.",
  "* Your filled with determination",
  "* You feel like  your gonna have a bad time.",
  "* Reading this doesn't seem like the best use of your time.",
  "* Sans is preparing something.",
];
window.phrases = phrases;
GameInstance.sounds.musique.play();
let menuSelect = [1, 0, 0, 0];

//write a random phrase on the terrain
writeText(phrases[randomNumber(phrases.length - 1)], "#terrain");

//create the events hanlers
newEvent("keydown", handleKeyDown);
newEvent("mousemove", handleMouseMove, "#menu");
newEvent("click", handleClick, "#menu");

const menuEvents = ["keydown", "mouseMove", "click"];
const menuEventFunctions = [handleKeyDown, handleMouseMove, handleClick];
const menuEventTargets = ["#menu", "#menu", null];

function handleKeyDown(e: Event) {
  if (!(e instanceof KeyboardEvent)) return;
  //check if we are in the menu
  if (GameInstance.state === "attack" || GameInstance.state === "defend")
    return;

  //Select the options with the arrow keys
  const menu = document.querySelector("#menu") as HTMLDivElement;
  switch (e.code) {
    case "ArrowLeft": {
      const id = menuSelect.indexOf(1);
      const selected = menu.children[id] as HTMLImageElement;
      const previous = menu.children[id - 1] as HTMLImageElement;
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
      const id = menuSelect.indexOf(1);
      const selected = menu.children[id] as HTMLImageElement;
      const next = menu.children[id + 1] as HTMLImageElement;
      if (id === 3) break;
      GameInstance.sounds.menu.play();
      menuSelect[id] = 0;
      menuSelect[id + 1] = 1;
      selected.classList.toggle("selected");
      next.classList.toggle("selected");
      next.src = next.src.replace(
        next.id.toUpperCase(),
        next.id.toUpperCase() + "selected"
      );
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

//Change the option image when the mouse is over it
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
  const oldSelected = document.querySelector(".selected") as HTMLImageElement;
  if (oldSelected) {
    oldSelected.src = oldSelected.src.replace(
      oldSelected.id.toUpperCase() + "selected",
      oldSelected.id.toUpperCase()
    );
    oldSelected.classList.remove("selected");
  }
  target.src = target.src.replace(
    target.id.toUpperCase(),
    target.id.toUpperCase() + "selected"
  );
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

// Select the option
function handleClick(e: Event) {
  if (!(e instanceof MouseEvent)) return;
  const target = e.target;
  if (!(target instanceof HTMLImageElement)) return;
  if (!["fight", "act", "item", "mercy"].includes(target.id)) return;
  selectOption(target);
}

//lock and unlock the menu from user input
function unlockMenu() {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  menu.style.pointerEvents = "auto";
  menuEvents.forEach((event, key) => {
    const eventName = event as keyof HTMLElementEventMap;
    newEvent(eventName, menuEventFunctions[key], "#menu");
  });
}
function lockMenu() {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  menu.style.pointerEvents = "none";
  menuEvents.forEach((event, key) => {
    const eventName = event as keyof HTMLElementEventMap;
    const eventTarget = menuEventTargets[key] as CSSselector | null;
    if (eventTarget) {
      removeEvent(eventName, menuEventFunctions[key], eventTarget);
    } else {
      removeEvent(eventName, menuEventFunctions[key]);
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
