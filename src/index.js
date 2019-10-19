import { Game } from "phaser";
import config from "./config";
import * as Scenes from "./scenes";

class BaseGame extends Game {
  constructor() {
    super(config);
    this.scene.add("Boot", Scenes.BootScene);
    this.scene.add("Game", Scenes.GameScene);
    this.scene.add("Menu", Scenes.MenuScene);
    this.scene.add("PreLoader", Scenes.PreLoader);
    this.scene.start("Boot");
  }
}

window.game = new BaseGame("Game Launching");
window.addEventListener("resize", event => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
