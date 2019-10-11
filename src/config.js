import "phaser";

export default {
  type: Phaser.WEBGL,
  parent: "phaser-game",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#14151d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};
