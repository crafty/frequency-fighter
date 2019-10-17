import { Scene } from "phaser";

/* Import assets */
import shipTwo from "../assets/images/ship2.png";
import shipThree from "../assets/images/ship3.png";
import projectile from "../assets/images/strip.png";
import InTheSummer from "../assets/music/In The Summer.mp3";
import Fireman from "../assets/music/Fireman.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);
    console.log(this);
  }

  preload() {
    /* Preload Images */
    this.load.image("projectile", projectile);
    this.load.image("shipTwo", shipTwo);
    this.load.image("shipThree", shipThree);

    /* Preload Audio */
    this.load.audio("In The Summer", InTheSummer);
    this.load.audio("Fireman", Fireman);
  }

  create() {
    this.scene.start(
      "Game" /*{ level: 1, newGame: true, levels: this.levels }*/
    );
  }
}

export default BootScene;
