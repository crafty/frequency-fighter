import { Scene } from "phaser";
import Stars from "../objects/Stars";
import MusicManager from "../objects/MusicManager";

class MenuScene extends Scene {
  constructor(key) {
    super(key);

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
  }
}

export default MenuScene;
