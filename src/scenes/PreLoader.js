import { Scene } from "phaser";

/* Particles */
import RedFlare from "../assets/particles/redFlare.png";

/* Import assets */
import shipTwo from "../assets/images/ship2.png";
import shipThree from "../assets/images/ship3.png";
import projectile from "../assets/images/projectile.png";
import OliverTreeHurt from "../assets/music/Oliver Tree - Hurt.mp3";
import InTheSummer from "../assets/music/In The Summer.mp3";
import Fireman from "../assets/music/Fireman.mp3";
import Home from "../assets/music/Home.mp3";

import * as Nebulas from "../assets/images/nebulas";
import * as Stars from "../assets/images/stars";

export default class PreLoader extends Scene {
  constructor() {
    super({
      key: "PreLoader",
      files: [{ type: "json", key: "assets", url: "../assets/assets.json" }]
    });
  }

  preload() {
    /* Set Scene Background Color */
    this.cameras.main.setBackgroundColor("#131112");

    /* Loading Information */
    const { width, height } = this.game.renderer;

    this.progressBox = this.add
      .graphics()
      .fillStyle(0x2a3036)
      .fillRect(width / 2 - 180, height / 2 - 25, 360, 50);
    this.progressBar = this.add.graphics();

    this.loadingText = this.make
      .text({
        x: width / 2,
        y: height / 2 - 50,
        text: "",
        style: {
          font: "28px Monogram",
          fill: "#EBECE8"
        }
      })
      .setOrigin(0.5, 0.5);

    this.percentText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "0%",
        style: {
          font: "24px Monogram",
          fill: "#FEFEFF"
        }
      })
      .setOrigin(0.5, 0.5);

    this.assetText = this.make
      .text({
        x: width / 2,
        y: height / 2 + 50,
        text: "",
        style: {
          font: "24px Monogram",
          fill: "#FEFEFF"
        }
      })
      .setOrigin(0.5, 0.5);

    this.nameText = this.make
      .text({
        x: width / 2,
        y: height - 50,
        text: "",
        style: {
          font: "24px Monogram",
          fill: "#e75a7c"
        }
      })
      .setOrigin(0.5, 0.5);

    this.load.on("progress", value => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xe75a7c);
      this.progressBar.fillRect(
        width / 2 - 170,
        height / 2 - 15,
        340 * value,
        30
      ); // 10 width 10 height
      this.percentText.setText(`${parseInt(value * 100)}%`);
    });

    this.load.on("fileprogress", file => {
      const formatedName = `${file.src.substring(0, 8)}${file.src.substring(
        file.src.indexOf("."),
        file.src.length
      )}`;
      this.assetText.setText(`Asset: ${formatedName}`);
      this.loadingText.setText(`LOADING...`);
      this.nameText.setText(`dancraycraft.dev`);
    });

    this.bump = this.tweens.add({
      targets: [this.loadingText, this.assetText],
      scale: { from: 1.3, to: 1 },
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 675,
      repeat: -1, // -1: infinity
      yoyo: false
    });

    this.load.on("complete", () => this.clear());

    /* Preload Images */
    this.load.image("projectile", projectile);
    this.load.image("shipTwo", shipTwo);
    this.load.image("shipThree", shipThree);

    /* Preload Audio */
    this.load.audio("In The Summer", InTheSummer);
    this.load.audio("Hurt", OliverTreeHurt);
    this.load.audio("Fireman", Fireman);
    this.load.audio("Home", Home);

    /* Particle Effects */
    this.load.image("redFlare", RedFlare);

    /* Import All Stars */
    this.load.image("Star - White - 1", Stars.StarOne);
    this.load.image("Star - White - 2", Stars.StarTwo);
    this.load.image("Star - Yellow", Stars.StarThree);
    this.load.image("Star - Blue - 1", Stars.StarFour);
    this.load.image("Star - Purple", Stars.StarFive);
    this.load.image("Star - Red", Stars.StarSix);

    /* Nebulas */
    this.load.image("NebulaOne", Nebulas.NebulaOne);
    this.load.image("NebulaTwo", Nebulas.NebulaTwo);
    this.load.image("NebulaThree", Nebulas.NebulaThree);
    this.load.image("NebulaFour", Nebulas.NebulaFour);
    this.load.image("NebulaSix", Nebulas.NebulaSix);
  }

  clear() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.loadingText.destroy();
    this.percentText.destroy();
  }

  create() {
    this.scene.start("Menu");
  }
}
