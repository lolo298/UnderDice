import "./style.css";
import "./fonts/stylesheet.css";

import { delay, writeText, newEvent, randomNumber, selectOption } from "./functions";

let menuSelect = [1, 0, 0, 0];
let timeoutRewrite: number;
await delay(1000);
var phrases = ["* You felt your sins crawling on your back.", "* Your filled with determination"];
// @ts-ignore
window["phrases"] = phrases;
writeText(phrases[0]);

newEvent("keydown", (e) => {
  if (!(e instanceof KeyboardEvent)) return;
  const menu = document.querySelector("#menu") as HTMLDivElement;
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  let p = document.createElement("p");
  switch (e.code) {
    case "ArrowLeft": {
      let id = menuSelect.indexOf(1);
      let selected = menu.children[id] as HTMLImageElement;
      let previous = menu.children[id - 1] as HTMLImageElement;
      if (id === 0) break;
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
});

let lastTarget: HTMLImageElement;
newEvent(
  "mousemove",
  (e) => {
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
    console.log(menuSelect);
  },
  "#menu"
);

newEvent(
  "click",
  (e) => {
    if (!(e instanceof MouseEvent)) return;
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (!["fight", "act", "item", "mercy"].includes(target.id)) return;
    console.log("click");
    console.log(target.id);
    selectOption(target);
  },
  "#menu"
);
