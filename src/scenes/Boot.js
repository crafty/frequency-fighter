import { Scene } from "phaser";
import assetsConfig from "../assets/assets.json";
import ChanceRoses from "../assets/music/ChanceRoses.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);
    console.log(this);
  }

  preload() {
    this.load.audio("ChanceRoses", ChanceRoses);
    this.load.json("assets", assetsConfig);
  }

  create() {
    /* Stars PreLoader */
    /* I wrapped this in a timeout to help fonts load before booting, look into a better fix later */
    setTimeout(() => this.scene.start("PreLoader"), 1200);
    setTimeout(
      () => this.sound.play("ChanceRoses", { volume: 0.5, loop: true }),
      1200
    );
  }
}

export default BootScene;
