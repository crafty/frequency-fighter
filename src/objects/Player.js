import { Physics } from "phaser";
import throttle from "lodash/throttle";
import playerGlowConfig from "../assets/particles/playerGlow.json";

class Player extends Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "shipThree");
    this.scene = scene;
    // Enable Physics
    this.scene.physics.world.enable(this);
    // Add our MainPlayer to the scene
    this.scene.add.existing(this);
    // Scale Player
    this.setScale(0.2);
    // Player health
    this.health = 100;
    // Player speed
    this.speed = 300;
    // Bullet Speed
    this.bulletSpeed = 550;
    // Fire Rate - lower = faster
    this.fireRate = 125;
    // Throttle the shoot method
    this.shoot = throttle(this.shoot, this.fireRate);
    // Set Velocity Rulesw
    this.setMaxVelocity(this.speed);
    this.setDrag(150, 150);

    // Set Player Collision
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(0.3, 0.3);

    // Set Player Screen Depth
    this.depth = 100;

    // Player Glow
    this.playerGlow();

    console.log(this);
  }

  rotateToMouse(mx, my, px, py) {
    const dist_Y = my - py;
    const dist_X = mx - px;
    const angle = Math.atan2(dist_Y, dist_X);
    return angle;
  }

  shoot() {
    const { rotation } = this;
    const x = this.x + Math.cos(rotation);
    const y = this.y + Math.sin(rotation);

    const bulletOne = this.scene.bullets.get(x, y);
    if (bulletOne) {
      bulletOne.setScale(0.25);
      bulletOne.setActive(true);
      bulletOne.setVisible(true);
      bulletOne.setOrigin(0, 2.8);
      bulletOne.x = x;
      bulletOne.y = y;
      bulletOne.rotation = rotation;
      bulletOne.setVelocity(
        Math.cos(rotation) * this.bulletSpeed,
        Math.sin(rotation) * this.bulletSpeed
      );
    }

    const bulletTwo = this.scene.bullets.get(x, y);
    if (bulletTwo) {
      bulletTwo.setScale(0.3);
      bulletTwo.setActive(true);
      bulletTwo.setVisible(true);
      bulletTwo.setOrigin(0, -2);
      bulletTwo.x = x;
      bulletTwo.y = y;
      bulletTwo.rotation = rotation;
      bulletTwo.setVelocity(
        Math.cos(rotation) * this.bulletSpeed,
        Math.sin(rotation) * this.bulletSpeed
      );
    }
  }

  playerGlow() {
    this.glow = this.scene.add
      .particles("redFlare")
      .createEmitter({ ...playerGlowConfig, x: this.x, y: this.y });
  }

  update(cursors) {
    // Reset Player Velocity
    this.setAcceleration(0, 0);

    // Player Movement
    if (cursors.up.isDown || cursors.upArrow.isDown) {
      this.body.setAccelerationY(-this.speed);
    }
    if (cursors.down.isDown || cursors.downArrow.isDown) {
      this.body.setAccelerationY(this.speed);
    }
    if (cursors.left.isDown || cursors.leftArrow.isDown) {
      this.body.setAccelerationX(-this.speed);
    }
    if (cursors.right.isDown || cursors.rightArrow.isDown) {
      this.body.setAccelerationX(this.speed);
    }

    const pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.shoot();
    }

    // Player Mouse Tracking
    this.rotation = this.rotateToMouse(
      this.scene.input.mousePointer.x,
      this.scene.input.mousePointer.y,
      this.x,
      this.y
    );

    // Remove Bullets
    this.scene.bullets.children.each(b => {
      if (b.active) {
        if (b.x > window.innerWidth) {
          b.setActive(false);
        } else if (b.y > window.innerHeight) {
          b.setActive(false);
        } else if (b.y < window.innerHeight * -1) {
          b.setActive(false);
        } else if (b.x < window.innerHeight * -1) {
          b.setActive(false);
        }
      }
    });

    /* Keep player glow on the player */
    this.glow.setPosition(this.x, this.y);
  }
}

export default Player;
