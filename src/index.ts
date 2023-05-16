import "./style.css";
import "./fonts/stylesheet.css";
import { AudioWriter } from "types";

const btn = document.querySelector("#start") as HTMLButtonElement;
const app = document.querySelector("#app") as HTMLDivElement;
talk();
btn.onclick = goToBattle;

//replace the html with the battle html
function goToBattle() {
  console.log("go to battle")
  const leaveHome = new CustomEvent("leaveHome");
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
  //load the battle script
  console.log("load battle")
  import("./main");
}

//start the conversation
async function talk() {
  const { writeText, delay } = await import("./functions");
  const audioToPlay: AudioWriter = {
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
  await writeText("For this you will throw two dice", ".bubbleBelow", audioToPlay);
  await delay(500);
  await writeText(
    "One that will determine the damage you will do to Sans",
    ".bubbleBelow",
    audioToPlay
  );
  await delay(1000);
  if (skip) return;
  await writeText("And another that will determine the damage you will receive", ".bubbleBelow", audioToPlay);
  await delay(1000);
  if (skip) return;
  await writeText("Good luck", ".bubbleBelow", audioToPlay);
  btn.style.display = "block";
  if(localStorage.getItem("expert") === "unlocked") {
    const btnExp = document.createElement("button");
    btnExp.innerText = "Expert Mode";
    btnExp.id = "expert";
    btnExp.style.display = "block";
    btnExp.onclick = () => {
      localStorage.setItem("expert", "true");
      goToBattle();
    }
    btn.after(btnExp);

  }
}
