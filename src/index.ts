import "./style.css";
import "./fonts/stylesheet.css";
import { writeText, delay } from "./functions";

const btn = document.querySelector("#start") as HTMLButtonElement;
const title = document.querySelector("hI") as HTMLDivElement;
const app = document.querySelector("#app") as HTMLDivElement;
talk();
btn.onclick = goToBattle;

function goToBattle() {
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
  const battleScript = document.createElement("script");
  battleScript.src = "src/main.ts";
  battleScript.type = "module";
  battleScript.async = true;
  document.body.appendChild(battleScript);
}

function goToHome() {
  const homeHTML = `
  <div id="home">
    <h1>UNDERTALE</h1>
    <button id="start">START</button>
  </div>
  `;
  app.style.display = "flex";
  app.style.flexDirection = "column";
  app.style.justifyContent = "flex-start";
  app.style.alignItems = "center";
  app.innerHTML = homeHTML;
  const homeScript = document.createElement("script");
  homeScript.src = "src/index.ts";
  homeScript.type = "module";
  homeScript.async = true;
  document.body.appendChild(homeScript);
}

async function talk() {
  await writeText("Howdy! I'm Flowey!", ".bubbleBelow");
  await delay(500);
  await writeText("Flowey the Flower!", ".bubbleBelow");
  await delay(500);
  await writeText("Welcome to UnderDice!", ".bubbleBelow");
  await delay(500);
  await writeText("In this game You'll have to fight Sans ", ".bubbleBelow");
  await delay(1000);
  await writeText(
    "For this you will throw a dice that will determine the damage you will deal",
    ".bubbleBelow"
  );
  await delay(1000);
  await writeText("And another one to take less damage", ".bubbleBelow");
  await delay(1000);
  await writeText("Good luck", ".bubbleBelow");
}
