import {
  AudioWriter,
  AudioWriterSettings,
  CSSselector,
  EventCreator,
  Game,
} from "types";
import throwDice from "./Dices";
let GameInstance: Game;
declare global {
  interface Window {
    GameInstance?: Game;
    phrases: string[];
  }
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
//write the text letter by letter with the sound wanted
let lastTimeout: number;
export async function writeText(
  phrase: string,
  target: CSSselector,
  audio: AudioWriter | null = null
) {
  if (window.GameInstance) GameInstance = window.GameInstance;

  let audioToPlay: HTMLAudioElement | null = null;
  let audioSettings: AudioWriterSettings | null = null;
  let audioType: string | undefined;
  if (audio != null) {
    audioToPlay = new Audio(audio.url);
    if (audio.settings) audioSettings = audio.settings;
    audioType = audioSettings?.name;
    if (audioSettings) {
      for (const setting in audioSettings)
        audioToPlay[setting] = audioSettings[setting];
    }
    const stopAudio = () => {
      if (audioToPlay == null) return;
      audioToPlay.pause();
      audioToPlay.currentTime = 0;
    };
    document.addEventListener("leaveHome", stopAudio, { once: true });
    document.addEventListener("toBattle", stopAudio, { once: true });
    document.addEventListener("stopText", stopAudio, { once: true });

    audioToPlay.play();
  } else {
    audioToPlay = GameInstance.sounds.type;
    audioType = "type";
    audioToPlay.play();
  }
  const container = document.querySelector(target);
  if (!container) throw new Error("container is not an HTMLElement");
  container.innerHTML = "";
  const p = document.createElement("p");
  container.appendChild(p);
  if (lastTimeout) clearTimeout(lastTimeout);
  for (const letter of phrase) {
    if (audioType == "type") {
      console.log("type");
      const loopAudio = audioToPlay?.cloneNode() as HTMLAudioElement;
      loopAudio.volume = GameInstance.sounds.type.volume;
      loopAudio.playbackRate = GameInstance.sounds.type.playbackRate;
      loopAudio.loop = false;
      loopAudio.play();
    }
    p.innerHTML += letter;
    await new Promise((r) => (lastTimeout = setTimeout(r, 50)));
  }
  if (audioToPlay != null) {
    audioToPlay.pause();
    audioToPlay.currentTime = 0;
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

export const randomNumber = (max: number, min = 0) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//select the option in the menu
export function selectOption(target: HTMLImageElement | number[]) {
  const menu = document.querySelector("#menu") as HTMLDivElement;
  let value = "";
  if (target instanceof HTMLImageElement) {
    value = target.id;
  }
  if (target instanceof Array) {
    value = menu.children[target.indexOf(1)].id;
  }
  const stopTextEvent = createCustomEvent("stopText");
  switch (value) {
    // Fight
    case "fight": {
      document.dispatchEvent(stopTextEvent);
      toBattle();
      break;
    }
    // Act
    case "act": {
      writeText("* You can't do that yet.", "#terrain");
      break;
    }
    // Item
    case "item": {
      writeText("* You can't do that yet.", "#terrain");
      break;
    }
    // Mercy
    case "mercy": {
      writeText("* You can't do that yet.", "#terrain");
      break;
    }
  }
}

//change the UI to the battle UI
export async function toBattle() {
  GameInstance.state = "attack";
  const battleEvent = createCustomEvent("toBattle");
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  terrain.innerHTML = "";
  const animation = terrain.animate([{ width: "40%" }], {
    duration: 500,
    fill: "forwards",
    easing: "ease-in-out",
  });
  await animation.finished;
  throwDice();
  document.dispatchEvent(battleEvent);
}

//change the UI to the menu UI
export function toMenu() {
  if (GameInstance.state === "win" || GameInstance.state === "lose") return;
  const menuEvent = createCustomEvent("toMenu");
  const terrain = document.querySelector("#terrain") as HTMLDivElement;
  const gameWidth = getComputedStyle(document.documentElement).getPropertyValue(
    "--gameWidth"
  );
  terrain.animate([{ width: gameWidth }], {
    duration: 500,
    fill: "forwards",
    easing: "ease-in-out",
  });
  terrain.classList.toggle("fight");
  terrain.innerHTML = "";
  const phrases = window.phrases;
  writeText(phrases[randomNumber(phrases.length - 1)], "#terrain");
  document.dispatchEvent(menuEvent);
}

export function createCustomEvent(eventName: string) {
  const event = new Event(eventName);
  return event;
}
