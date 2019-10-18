import { Scene } from "phaser";

/* Import assets */
import shipTwo from "../assets/images/ship2.png";
import shipThree from "../assets/images/ship3.png";
import projectile from "../assets/images/projectile.png";
import InTheSummer from "../assets/music/In The Summer.mp3";
import Fireman from "../assets/music/Fireman.mp3";
import Home from "../assets/music/Home.mp3";

/* Particles */
import RedFlare from "../assets/particles/redFlare.png";
import * as Stars from "../assets/images/stars";

class BootScene extends Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    /* Preload Images */
    this.load.image("projectile", projectile);
    this.load.image("shipTwo", shipTwo);
    this.load.image("shipThree", shipThree);

    /* Preload Audio */
    this.load.audio("In The Summer", InTheSummer);
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
  }

  create() {
    this.scene.start(
      "Game" /*{ level: 1, newGame: true, levels: this.levels }*/
    );
  }
}

export default BootScene;
