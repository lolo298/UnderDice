import "./style.css";
import "./fonts/stylesheet.css";
import { writeText, delay } from "./functions";
import { AudioWriter } from "types";

const btn = document.querySelector("#start") as HTMLButtonElement;
// const title = document.querySelector("hI") as HTMLDivElement;
const app = document.querySelector("#app") as HTMLDivElement;
talk();
btn.onclick = goToBattle;

function goToBattle() {
  let leaveHome = new CustomEvent("leaveHome");
  document.dispatchEvent(leaveHome);

  const battleHTML = `
  <div id="battle">
    <div class="flowey">
      <img src="" id="flowey" />
    </div>
    <div  class="container">
      <img src="" class="attack" id="slice"></img>
      <img src="" class="attack" id="damage"></img>
      <img src="assets/Sans_idle.gif" alt="Sans idle" id="sans" />
    </div>
  </div>
  <div id="terrain"></div>
  <div id="info">
    <p>CHARA</p>
    <p>LV 19</p>
    <div id="life">
      <p>HP</p>
      <div id="lifeBar">
        <div id="current"></div>
        <div id="max"></div>
      </div>
      <p id="counter">20 / 20</p>
    </div>

  </div>
  <div id="menu">
    <img src="assets/FIGHTselected.png" alt="Fight" id="fight" class="selected" />
    <img src="assets/ACT.png" alt="Act" id="act" />
    <img src="assets/ITEM.png" alt="Item" id="item" />
    <img src="assets/MERCY.png" alt="Mercy" id="mercy" />
  </div>
  `;
  app.style.display = "";
  app.style.flexDirection = "";
  app.style.justifyContent = "";
  app.style.alignItems = "";
  app.innerHTML = battleHTML;
  // const battleScript = document.createElement("script");
  // battleScript.src = "src/main.ts";
  // battleScript.type = "module";
  // battleScript.async = true;
  // document.body.appendChild(battleScript);
  import("./main");
}

// function goToHome() {
//   const homeHTML = `
//   <div id="home">
//     <h1>UNDERTALE</h1>
//     <button id="start">START</button>
//   </div>
//   `;
//   app.style.display = "flex";
//   app.style.flexDirection = "column";
//   app.style.justifyContent = "flex-start";
//   app.style.alignItems = "center";
//   app.innerHTML = homeHTML;
//   const homeScript = document.createElement("script");
//   homeScript.src = "src/index.ts";
//   homeScript.type = "module";
//   homeScript.async = true;
//   document.body.appendChild(homeScript);
// }

async function talk() {
  let audioToPlay: AudioWriter = {
    url: "./assets/sounds/snd_floweytalk1.wav",
    settings: {
      name: "flowey",
      volume: 0.5,
      loop: true,
      playbackRate: 0.8,
    },
  };

  let skip = false;
  //exit the function talk when recieve the event leaveHome
  document.addEventListener("leaveHome", () => {
    skip = true;
  });

  if (skip) return;
  await writeText("Howdy! I'm Flowey!", ".bubbleBelow", audioToPlay);
  await delay(500);
  if (skip) return;
  await writeText("Flowey the Flower!", ".bubbleBelow", audioToPlay);
  await delay(500);
  if (skip) return;
  await writeText("Welcome to UnderDice!", ".bubbleBelow", audioToPlay);
  await delay(500);
  if (skip) return;
  await writeText("In this game You'll have to fight Sans ", ".bubbleBelow", audioToPlay);
  await delay(1000);
  if (skip) return;
  await writeText(
    "For this you will throw a dice that will determine the damage you will deal",
    ".bubbleBelow",
    audioToPlay
  );
  await delay(1000);
  if (skip) return;
  await writeText("And another one to take less damage", ".bubbleBelow", audioToPlay);
  await delay(1000);
  if (skip) return;
  await writeText("Good luck", ".bubbleBelow", audioToPlay);
}
