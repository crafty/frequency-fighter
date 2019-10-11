import { GameObjects } from "phaser";

class Stars extends GameObjects.TileSprite {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.create();
    console.log(this);
  }

  paralaxStars() {
    const { x, y } = this.scene.player.body.velocity;
    const backgroundSpeedReducer = 80;
    const foreGroundSpeedReducer = 40;
    const midGroundSpeedReducer = 60;
    const tippyTopReducer = 55;

    if (x !== 0) {
      if (x > 0) {
        this.starsBack.x -= x / backgroundSpeedReducer;
        this.starsFront.x -= x / foreGroundSpeedReducer;
        this.starsMid.x -= x / midGroundSpeedReducer;
        this.starsTippyTop.x -= x / tippyTopReducer;
      }
      if (x < 0) {
        this.starsBack.x -= x / backgroundSpeedReducer;
        this.starsFront.x -= x / foreGroundSpeedReducer;
        this.starsMid.x -= x / midGroundSpeedReducer;
        this.starsTippyTop.x -= x / tippyTopReducer;
      }
    }

    if (y !== 0) {
      if (y < 0) {
        this.starsBack.y -= y / backgroundSpeedReducer;
        this.starsFront.y -= y / foreGroundSpeedReducer;
        this.starsMid.y -= y / midGroundSpeedReducer;
        this.starsTippyTop.y -= y / tippyTopReducer;
      }
      if (y > 0) {
        this.starsBack.y -= y / backgroundSpeedReducer;
        this.starsFront.y -= y / foreGroundSpeedReducer;
        this.starsMid.y -= y / midGroundSpeedReducer;
        this.starsTippyTop.y -= y / tippyTopReducer;
      }
    }
  }

  create() {
    const width = window.innerWidth * 4;
    const height = window.innerHeight * 4;
    const { scene } = this;
    this.starsBack = scene.add.tileSprite(0, 0, width, height, "starsOne");
    this.starsFront = scene.add.tileSprite(0, 0, width, height, "starsTwo");
    this.starsMid = scene.add.tileSprite(0, 0, width, height, "starsThree");
    this.starsTippyTop = scene.add.tileSprite(0, 0, width, height, "starsFour");

    // this.starsBack.setOrigin(0);
    // this.starsFront.setOrigin(0);
    // this.starsMid.setOrigin(0);
    // this.starsTippyTop.setOrigin(0);
  }

  update() {
    // Scroll background with player movement
    this.paralaxStars();
  }
}

export default Stars;

// window.sn = this;

// var w = this.cameras.main.width;
// var h = this.cameras.main.height;

// var tex = this.textures.createCanvas('sky', w, h / 1.5);
// var ctx = tex.getContext();
// var grad = ctx.createLinearGradient(0, 0, 0, h / 1.5);
// grad.addColorStop(0, '#000001')
// grad.addColorStop(.5, '#000000');
// grad.addColorStop(1, '#000010');
// ctx.fillStyle = grad;
// ctx.fillRect(0, 0, w, h / 1.5);
// tex.refresh();

// let sp = this.cameras.main.getWorldPoint(0, 0)
// this.sky = this.add.image(0, 0, 'sky').setOrigin(0)
// var stars = []
// this.stars = stars
// var i = 0;
// console.log(sp.x - w, 0, sp.x + w, h * .7)
// while (i++ < 80)
//     stars.push(this.add.image(0, 0, _.sample(['star09', 'star08', 'star08', 'star08', 'star08']))
//         .setScale(Phaser.Math.FloatBetween(.02, .03))
//         .setRandomPosition(sp.x - w / 2, -(h / 2), sp.x + w, h * 2)
//         .setAlpha(Phaser.Math.FloatBetween(.2, .7))
//         .setAngle(Math.random() * Math.PI));
// this.add.tween({
//     targets: stars,
//     angle: () => Phaser.Math.FloatBetween(10, 90),
//     duration: 3000,
//     yoyo: true,
//     repeat: -1,
//     delay: () => Phaser.Math.Between(20, 3000),
//     ease: 'Sine.easeInOut',
//     scaleX: (img) => img.scaleX + Phaser.Math.FloatBetween(-.01, .5),
//     scaleY: (img) => img.scaleX + Phaser.Math.FloatBetween(-.01, .5),
//     alpha: () => Phaser.Math.FloatBetween(.3, 1)
// });
// this.generateSegment()
// // this.makeButton()
// this.velHistory = []
// this.yHistory = []
// // this.cameras.main.setFollowOffset(0, -200)
