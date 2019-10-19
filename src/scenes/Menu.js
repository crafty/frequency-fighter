import { Scene } from "phaser";
import Stars from "../objects/Stars";
import Stats from "stats.js";
import MusicManager from "../objects/MusicManager";

class MenuScene extends Scene {
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
    this.musicManager = new MusicManager(this);
    this.musicManager.create();
  }

  create() {
    const { width, height } = this.game.renderer;

    this.playText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "PLAY",
        style: {
          font: "42px",
          fill: "#FEFEFF"
        }
      })
      .setOrigin(0.5, 0.5)
      .setDepth(100)
      .setInteractive()
      .on("pointerup", () => {
        this.sound.sounds[0].stop();
        this.scene.start("Game");
        this.stars.destroy();
      });

    /* Menu Background */
    this.createBackground();
  }

  createBackground() {
    this.stars = new Stars(this, {
      sceneName: "MenuScene"
    });
  }

  update() {
    this.stars.update();
    this.musicManager.update();

    /* Update Stats Dev Tools */
    this.statsOne.update();
    this.statsTwo.update();
  }
}

export default MenuScene;
