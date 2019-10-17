import { Scene } from "phaser";
import Stats from "stats.js";
import Player from "../objects/Player";
import MusicManager from "../objects/MusicManager";
import Stars from "../objects/Stars";

class GameScene extends Scene {
  constructor(key) {
    super(key);

    /* Dev Tools */
    this.stats = new Stats();
    this.stats.showPanel(0); // 0 FPS

    /* Configure Stats.js dev tools */
    this.statsTwo = new Stats();
    this.statsTwo.showPanel(2); // 2 Memory
    this.statsTwo.domElement.style.cssText =
      "position:absolute;top:0px;left:80px;";
    document.body.appendChild(this.stats.dom);
    document.body.appendChild(this.statsTwo.dom);
  }

  create() {
    // Listen for resize event
    this.events.on("resize", this.resize, this);

    // Listen for player input
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN
    });

    // Creates everything needed for this scene
    this.createGameScene();

    // Set Game Cursor
    this.input.setDefaultCursor(`crosshair`);
  }

  update() {
    // Calling player.update method for movement
    this.player.update(this.cursors);

    // Calling stars.update method for paralaxing
    this.stars.update();

    // Update Music Manager
    this.musicManager.update();

    /* Update Stats Dev Tools */
    this.stats.update();
    this.statsTwo.update();
  }

  createGameScene() {
    // Add Stars
    this.stars = new Stars(this);

    // Add Bullets Group
    this.bullets = this.physics.add.group({
      defaultKey: "projectile",
      maxSize: 200
    });

    // Create Our Player
    this.player = new Player(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    // Create Music Manager
    this.musicManager = new MusicManager(this);
  }

  resize(width, height) {
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }
  }
}

export default GameScene;
