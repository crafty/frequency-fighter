import { Scene } from "phaser";
import assetsConfig from "../assets/assets.json";
import ReachOut from "../assets/music/Reach Out.mp3";

class BootScene extends Scene {
  constructor(key) {
    super(key);
    console.log(this);
  }

  preload() {
    this.load.audio("ReachOut", ReachOut);
    this.load.json("assets", assetsConfig);
  }

  create() {
    this.sound.play("ReachOut", { volume: 0.4, loop: true });

    /* Stars PreLoader */
    this.scene.start("PreLoader");
  }
}

export default BootScene;
