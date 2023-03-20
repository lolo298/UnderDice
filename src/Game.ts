import { gameState } from "types";
import Dice from "./Dices";
import { randomNumber, toMenu, writeText } from "./functions";

export default class Game {
  private sansLife: number = 20;
  private sansLifeMax: number = 20;
  private sansSprite: HTMLImageElement;
  private charaLife: number = 20;
  private charaLifeMax: number = 20;
  private charaLifeBar: HTMLElement;
  private charaLifeBarMax: HTMLElement;
  private attackSprite: HTMLImageElement;
  private damageSprite: HTMLImageElement;
  private terrain: HTMLDivElement;
  public state: gameState = "idle";

  public constructor() {
    const charaLifeBar = document.querySelector("#lifeBar #current");
    const charaLifeBarMax = document.querySelector("#lifeBar #max");
    const attackSprite = document.querySelector("#slice");
    const sansSprite = document.querySelector("#sans");
    const damageSprite = document.querySelector("#damage");
    const terrain = document.querySelector("#terrain");
    if (!(charaLifeBar instanceof HTMLElement))
      throw new Error("charaLifeBar is not an HTMLElement");
    if (!(charaLifeBarMax instanceof HTMLElement))
      throw new Error("charaLifeBarMax is not an HTMLElement");
    if (!(attackSprite instanceof HTMLImageElement))
      throw new Error("attackSprite is not an HTMLImageElement");
    if (!(sansSprite instanceof HTMLImageElement))
      throw new Error("sansSprite is not an HTMLImageElement");
    if (!(damageSprite instanceof HTMLImageElement))
      throw new Error("damageSprite is not an HTMLImageElement");
    if (!(terrain instanceof HTMLDivElement)) throw new Error("terrain is not an HTMLDivElement");
    this.charaLifeBar = charaLifeBar;
    this.charaLifeBarMax = charaLifeBarMax;
    this.attackSprite = attackSprite;
    this.sansSprite = sansSprite;
    this.damageSprite = damageSprite;
    this.terrain = terrain;
  }

  public getCharaLife(): number {
    return this.charaLife;
  }
  public getCharaLifeMax(): number {
    return this.charaLifeMax;
  }
  public getSansLife(): number {
    return this.sansLife;
  }
  public getSansLifeMax(): number {
    return this.sansLifeMax;
  }
  public attack(damage: number): void {
    this.sansLife -= damage;
    this.damageSprite.src = `./assets/damages/spr_dmgnum_${damage}.png`;
    //30FPS
    const fps = 30;
    let frames = 0;
    let attack = 0;
    const interval = setInterval(() => {
      if (frames >= 30) {
        this.attackSprite.src = "";
        this.sansSprite.src = "./assets/Sans_idle.gif";
        this.damageSprite.src = "";
        clearInterval(interval);
        const terrain = document.querySelector("#terrain");
        if (!(terrain instanceof HTMLDivElement))
          throw new Error("terrain is not an HTMLDivElement");
        terrain.innerHTML = "";
        setTimeout(() => {
          this.state = "defend";
          Dice();
        }, 500);
        return;
      }
      if (frames % 10 === 0) {
        this.sansSprite.src = `./assets/Sans_fatal.png`;

        let keyframes = [
          { transform: "translateX(0px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(0px)" }
        ];
        let options = {
          duration: (1000 / fps) * 10,
          iterations: 1,
          easing: "steps(3, end)"
        };
        this.sansSprite.animate(keyframes, options);
      }
      if (frames % 5 === 0) {
        this.attackSprite.src = `./assets/spr_slice_o_${attack}.png`;
        attack++;
      }
      frames++;
    }, 1000 / fps);
  }
  public defend(DefendingDamage: number): void {
    console.log("Defending");
    let damage = 6 - DefendingDamage;
    setTimeout(() => {
      this.terrain.innerHTML = "";
      const soul = document.createElement("img");
      soul.src = "./assets/spr_heart_battle_pl_0.png";
      soul.classList.add("soul");
      this.terrain.appendChild(soul);
      this.spawnBlaster(soul, damage);
    }, 500);
  }

  public async spawnBlaster(soul: HTMLImageElement, damage: number): Promise<void> {
    this.terrain.classList.add("fight");
    const blaster = document.createElement("img");
    blaster.src = "./assets/sansAttacks/spr_gasterblaster_0.png";
    blaster.classList.add("blaster");
    document.querySelector("#app")?.appendChild(blaster);
    const laser = document.createElement("div");
    laser.classList.add("laser");
    document.querySelector("#app")?.appendChild(laser);

    let keyframes = [
      { transform: `scale(0) rotate(0) ` },
      { transform: `scale(6) rotate(450deg)` } //rotate(${360 + angleDeg}deg)
    ];
    let options = {
      duration: 1000,
      iterations: 1,
      easing: "ease-in-out",
      fill: "forwards" as "forwards"
    };
    let blasterAnimation = blaster.animate(keyframes, options);
    const fps = 60;
    let frames = 0;
    let img = 0;
    await new Promise((r) => {
      let interval = setInterval(() => {
        if (frames >= 60) {
          clearInterval(interval);
          this.sansSprite.src = "./assets/Sans_idle.gif";
          this.sansSprite.style.width = "100%";
          r("done");
          return;
        }
        if (frames % 15 === 0) {
          this.sansSprite.src = `./assets/sansAttacks/spr_sansb_handdown_${img}.png`;
          img++;
        }
        frames++;
      }, 1000 / fps);
    });
    await blasterAnimation.finished;
    //@ts-ignore
    keyframes = [{ maxWidth: "0%" }, { maxWidth: "100%" }];
    options = {
      duration: 400,
      iterations: 1,
      easing: "ease-in-out",
      fill: "forwards" as "forwards"
    };
    if (damage === 0) {
      var soulKeyframes = [
        { transform: `translate(0,0) ` },
        { transform: `translate(0, 800%)` } //rotate(${360 + angleDeg}deg)
      ];
      var soulOptions = {
        duration: 300,
        iterations: 1,
        easing: "ease-in-out",
        fill: "forwards" as "forwards"
      };
    }
    frames = 0;
    img = 0;
    let interval = setInterval(async () => {
      if (frames >= 30) {
        clearInterval(interval);
        soul.animate(soulKeyframes, soulOptions);
        let laserAnimation = laser.animate(keyframes, options);
        setTimeout(() => {
          this.charaLife -= damage;
          this.charaLifeBar.style.width = `${(this.charaLife / this.charaLifeMax) * 100}%`;
          this.checkEnd();
          if (this.state === "lose") {
            laserAnimation.pause();
            this.toGameOver();
          }
        }, 400);
        await laserAnimation.finished;
        keyframes = [
          //@ts-ignore
          { transform: `scale(1, 1)`, opacity: 1 },
          //@ts-ignore
          { transform: `scale(1, 0.5)`, opacity: 0 }
        ];
        options = {
          duration: 1000,
          iterations: 1,
          easing: "ease-in-out",
          fill: "forwards" as "forwards"
        };
        laser.animate(keyframes, options);
        await blaster.animate({ opacity: 0 }, { duration: 1000, iterations: 1 }).finished;
        blaster.remove();
        laser.remove();
        soul.remove();
        this.state = "idle";
        toMenu();
        return;
      }
      if (frames % 5 === 0) {
        blaster.src = `./assets/sansAttacks/spr_gasterblaster_${img}.png`;
        img++;
      }
      frames++;
    }, 1000 / fps);
  }

  private checkEnd(): void {
    if (this.charaLife <= 0) {
      this.state = "lose";
      return;
    }
    if (this.sansLife <= 0) {
      this.state = "win";
      return;
    }
  }
  public toGameOver(): void {
    let gameOverPhrases = [
      "Don't lose hope",
      "You cannot give up just yet ... CHARA! Stay determined!",
      "Don't lose hope! CHARA! Stay determined!",
      "Our fate rests upon you... CHARA! Stay determined...",
      "CHARA, please... wake up! The fate of humans and monsters depends on you!",
      "CHARA! You have to stay determined! You can't give up... You are the future of humans and monsters...",
      "wake up! It's not over!",
      "Please don't give up..."
    ];
    const endBackground = document.createElement("div");
    endBackground.classList.add("endBackground");
    document.querySelector("#app")?.appendChild(endBackground);
    const endText = document.createElement("img");
    endText.src = "./assets/spr_gameoverbg_0.png";
    endText.classList.add("endText");
    endBackground.appendChild(endText);
    const endp = document.createElement("p");
    endBackground.appendChild(endp);
    endp.classList.add("endp");
    writeText(gameOverPhrases[randomNumber(gameOverPhrases.length - 1)], ".endp");
  }
}
