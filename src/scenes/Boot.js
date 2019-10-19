import { Scene } from "phaser";
import assetsConfig from "../assets/assets.json";
import ChanceRoses from "../assets/music/ChanceRoses.mp3";
import MacMiller from "../assets/music/MacMiller.mp3";
import Paak from "../assets/music/Paak.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);
    console.log(this);
  }

  preload() {
    this.load.audio("Paak", ChanceRoses);
    //this.load.audio("ReachOut", ReachOut);
    this.load.json("assets", assetsConfig);
  }

  create() {
    /* Stars PreLoader */
    /* I wrapped this in a timeout to help fonts load before booting, look into a better fix later */
    setTimeout(() => this.scene.start("PreLoader"), 1200);
    setTimeout(
      () => this.sound.play("Paak", { volume: 0.5, loop: true }),
      1200
    );
  }
}

export default BootScene;
