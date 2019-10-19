import { Scene } from "phaser";
import Stats from "stats.js";
import InTheSummer from "../assets/music/In The Summer.mp3";
import OliverTreeHurt from "../assets/music/Oliver Tree - Hurt.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);

    /* Configure Stats.js dev tools */
    this.statsOne = new Stats();
    this.statsOne.showPanel(0); // 0 FPS

    this.statsTwo = new Stats();
    this.statsTwo.showPanel(2); // 2 Memory

    document.body.appendChild(this.statsOne.dom);
    document.body.appendChild(this.statsTwo.dom);

    this.statsTwo.domElement.style.cssText =
      "position:absolute;top:0px;left:80px;";

    console.log(this);
  }

  preload() {
    this.load.audio("OliverTreeHurt", OliverTreeHurt);
  }

  create() {
    this.sound.play("OliverTreeHurt", { volume: 0.3 });

    /* Stars PreLoader */
    this.scene.start("PreLoader");
  }

  update() {
    /* Update Stats Dev Tools */
    this.statsOne.update();
    this.statsTwo.update();
  }
}

export default BootScene;
