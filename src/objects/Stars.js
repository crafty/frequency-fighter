import { GameObjects } from "phaser";

class Stars extends GameObjects.TileSprite {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.create();
    console.log(this);
  }

  generateStars({ numberOfStars, starSize, spaceBetween, color }) {
    /* Generate Random Circles (Star Test) On Screen */
    let starField = this.scene.add.group();

    /* Init Vars */
    let counter = 0,
      protection = 15000,
      overlapping = false,
      star = null,
      stars = [];

    /* Loop and generate stars until the amount is reached */
    while (stars.length < numberOfStars && counter < protection) {
      star = {
        x: Math.random() * window.innerWidth * 2.5,
        y: Math.random() * window.innerHeight * 2.5,
        r: starSize
      };

      overlapping = false;

      /* Loop over generated stars and check if any overlap with the new star */
      stars.forEach(item => {
        let distance = Phaser.Math.Distance.Between(
          star.x,
          star.y,
          item.x,
          item.y
        );
        if (distance < starSize + spaceBetween) {
          overlapping = true;
          return;
        }
      });

      /* Add the star to the stars list and render it to the screen */
      if (!overlapping) {
        stars.push(star);
        const newStar = this.scene.add.circle(
          star.x,
          star.y,
          star.r,
          `0x${color}`
        );
        starField.add(newStar);
      }
      counter++;
    }
    return starField;
  }

  paralaxStars() {
    const { x, y } = this.scene.player.body.velocity;
    const { starfields } = this;
    const backDamper = 0.0125;
    const midDamper = 0.02;
    const frontDamper = 0.035;

    /* Paralax stars if the player moves on the X axis */
    if (x !== 0) {
      starfields.forEach((starfield, i) => {
        starfield.children.each(star => {
          const damper =
            (i === 0 && backDamper) ||
            (i === 1 && midDamper) ||
            (i === 2 && frontDamper);
          star.x -= x * damper;
        });
      });
    }
    /* Paralax stars if the player moves on the Y axis */
    if (y !== 0) {
      starfields.forEach((starfield, i) => {
        starfield.children.each(star => {
          const damper =
            (i === 0 && backDamper) ||
            (i === 1 && midDamper) ||
            (i === 2 && frontDamper);
          star.y -= y * damper;
        });
      });
    }
  }

  create() {
    /* Randomly generate starfield */

    this.starfieldBack = this.generateStars({
      numberOfStars: 125,
      starSize: 5,
      spaceBetween: 40,
      color: "404853"
    });
    this.starfieldMid = this.generateStars({
      numberOfStars: 60,
      starSize: 13,
      spaceBetween: 80,
      color: "637081"
    });
    this.starfieldFront = this.generateStars({
      numberOfStars: 30,
      starSize: 20,
      spaceBetween: 120,
      color: "C6CBD1"
    });

    this.starfields = [
      this.starfieldBack,
      this.starfieldMid,
      this.starfieldFront
    ];

    this.starfields.forEach((starfield, i) => {
      /* Set the starting location for each star */
      starfield.children.each(star => {
        star.x = star.x -= window.innerWidth / 2;
        star.y = star.y -= window.innerHeight / 2;
        star.alpha = 0.5;
      });
    });
  }

  update() {
    // Scroll background with player movement
    this.paralaxStars();
  }
}

export default Stars;
