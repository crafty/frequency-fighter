import { Scene } from "phaser";
import shipTwo from "../assets/images/ship2.png";
import shipThree from "../assets/images/ship3.png";
import starsOne from "../assets/images/Stars Small_1.png";
import starsTwo from "../assets/images/Stars Big_1.png";
import starsThree from "../assets/images/Stars Small_2.png";
import starsFour from "../assets/images/Stars Big_2.png";
import projectile from "../assets/images/strip.png";

import queen from "../assets/music/Queen - Don't Stop Me Now.mp3";
import drake from "../assets/music/Drake.mp3";
import tock from "../assets/music/Tock.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    /* Preload Images */
    this.load.image("projectile", projectile);
    this.load.image("starsOne", starsOne);
    this.load.image("starsTwo", starsTwo);
    this.load.image("starsThree", starsThree);
    this.load.image("starsFour", starsFour);
    this.load.image("shipTwo", shipTwo);
    this.load.image("shipThree", shipThree);

    /* Preload Audio */
    this.load.audio("queen", queen);
    this.load.audio("drake", drake);
    this.load.audio("tock", tock);
  }

  create() {
    this.scene.start(
      "Game" /*{ level: 1, newGame: true, levels: this.levels }*/
    );
  }
}

export default BootScene;
