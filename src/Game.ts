import Dice from "./Dices";

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
  public state: "attack" | "defend" | "idle" = "idle";

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
    this.charaLife -= 6 - DefendingDamage;
    // this.charaLifeBar.style.width = `${(this.charaLife / this.charaLifeMax) * 100}%`;
    setTimeout(() => {
      this.terrain.innerHTML = "";
      const soul = document.createElement("img");
      soul.src = "./assets/spr_heart_battle_pl_0.png";
      soul.classList.add("soul");
      this.terrain.appendChild(soul);
      this.spawnBlaster(soul);
    }, 500);
  }

  public spawnBlaster(soul: HTMLImageElement): void {
    const soulRect = soul.getBoundingClientRect();
    const soulCenter = {
      x: soulRect.x + soulRect.width / 2,
      y: soulRect.y + soulRect.height / 2
    };
    const blaster = document.createElement("img");
    blaster.src = "./assets/sansAttacks/spr_gasterblaster_0.png";
    blaster.classList.add("blaster");
    document.querySelector("#app")?.appendChild(blaster);
    const blasterRect = blaster.getBoundingClientRect();
    const blasterCenter = {
      x: blasterRect.x + blasterRect.width / 2,
      y: blasterRect.y + blasterRect.height / 2
    };
    var angleDeg =
      (Math.atan2(soulCenter.y - blasterCenter.y, soulCenter.x - blasterCenter.x) * 180) / Math.PI;
    let keyframes = [{ transform: "rotate(0)" }, { transform: `rotate(${angleDeg}deg)` }];
    let options = {
      duration: 1000,
      iterations: 1
    };
    blaster.animate(keyframes, options);
  }
}
