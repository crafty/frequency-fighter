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

    this.bar = this.add.graphics();

    this.playText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "P L A Y",
        style: {
          fontFamily: 'Teko, "sans-serif"',
          fontSize: "38px",
          fill: "#FEFEFF",
          letterSpacing: 200
        }
      })
      .setOrigin(0.5, 0.5)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        this.sound.sounds[0].stop();
        this.scene.start("Game");
        this.stars.destroy();
      });

    this.analyzerBar = this.add
      .graphics()
      .fillStyle(0x282828)
      .fillRect(0, height / 2 - 30, width, 60);

    /* Menu Background */
    this.createBackground();

    setTimeout(() => this.playText.updateText(), 25);
  }

  createBackground() {
    this.stars = new Stars(this, {
      sceneName: "MenuScene"
    });
  }

  update() {
    const { width, height } = this.game.renderer;

    this.stars.update();
    this.musicManager.update();

    /* Update Stats Dev Tools */
    this.statsOne.update();
    this.statsTwo.update();

    const { averageAmplitude = 0, freqByteData } = this.musicManager;
    this.playText.scale = averageAmplitude + 1;

    if (freqByteData) {
      const barWidth = 20;
      const numberOfBars = width / barWidth + 6;

      let trimmedArray = freqByteData.slice(5, numberOfBars);
      this.bar.clear();
      for (let i = 0; i < trimmedArray.length; i++) {
        let value = freqByteData[i];
        console.log(value);
        let barHeight = value === 0 ? 10 : value;
        barHeight = barHeight / 3 > 60 ? 60 : barHeight;
        this.bar
          .fillStyle(0x2274a5)
          .setDepth(100)
          .setAlpha(0.7)
          .fillRect(i * barWidth, height / 2 + 30, barWidth, -barHeight / 3);
      }
    }
  }
}

export default MenuScene;
