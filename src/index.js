import { Game } from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";
import BootScene from "./scenes/Boot";

class BaseGame extends Game {
  constructor(word) {
    super(config);
    this.scene.add("Boot", BootScene);
    this.scene.add("Game", GameScene);
    this.scene.start("Boot");
    // this.words = word;
  }
}

window.game = new BaseGame("Game Launching");
window.addEventListener("resize", event => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
