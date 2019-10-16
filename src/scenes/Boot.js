import { Scene } from "phaser";

/* Import assets */
import shipTwo from "../assets/images/ship2.png";
import shipThree from "../assets/images/ship3.png";
import projectile from "../assets/images/strip.png";
import queen from "../assets/music/Queen - Don't Stop Me Now.mp3";
import drake from "../assets/music/Drake.mp3";

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
    this.load.audio("queen", queen);
    //this.load.audio("drake", drake);
  }

  create() {
    this.scene.start(
      "Game" /*{ level: 1, newGame: true, levels: this.levels }*/
    );
  }
}

export default BootScene;
