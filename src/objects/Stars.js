import { GameObjects } from "phaser";
import random from "lodash/random";

class Stars extends GameObjects.TileSprite {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.extraWidth = innerWidth * 2;
    this.extraHeight = innerHeight * 2;
    this.screenSpace = window.innerWidth + window.innerHeight;

    this.create();
    console.log(this);
  }

  generateStars({ numberOfStars, scale, spaceBetween, images, placement }) {
    const { screenWidth, screenHeight, extraWidth, extraHeight } = this;
    /* Generate Random Circles (Star Test) On Screen */
    let starField = this.scene.add.group();

    /* Init Vars */
    let counter = 0,
      protection = 10000,
      overlapping = false,
      star = null,
      stars = [];

    /* Loop and generate stars until the amount is reached */
    while (stars.length < numberOfStars && counter < protection) {
      /* Set star spawn point | Extra paralaxing space */
      star = {
        x: random(0, screenWidth + extraWidth),
        y: random(0, screenHeight + extraHeight)
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

        const starRadius = (200 * scale) / 2;
        if (distance < starRadius + spaceBetween) {
          overlapping = true;

          return;
        }
      });

      /* Add the star to the stars list and render it to the screen */
      if (!overlapping) {
        /* Pick a random star image from assets, colored stars as highlights */
        /* 0 <-> 1 = white stars | 2 <-> length = colors */
        let index;
        if (placement === "back") {
          index =
            stars.length % 2 === 0 ? random(2, images.length) : random(0, 1);
        } else {
          index = 0;
        }

        /* Generate a new star image */
        let newStar = this.scene.add.image(star.x, star.y, images[index]);

        /* Set some default props */
        newStar.alpha = 0.5;
        newStar.scale = scale;
        starField.baseScale = scale;
        /* Add the star to the list and the scene */
        stars.push(star);
        starField.add(newStar);
      }
      counter++;
    }
    counter >= protection &&
      console.log(`Overlaped protection limit reached: ${counter}`);
    overlapping && console.log("overlapping");
    return starField;
  }

  paralaxStars() {
    const { x, y } = this.scene.player.body.velocity;
    const { starfields } = this;
    const backDamper = 0.0125;
    const midDamper = 0.02;
    const frontDamper = 0.03;

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
    /* numberOfStars * spaceBetween must be less than screenSpace */
    this.starfieldBack = this.generateStars({
      placement: "back",
      numberOfStars: 250,
      scale: 0.01,
      spaceBetween: 10,
      images: [
        "Star - White - 1",
        "Star - White - 2",
        "Star - Blue - 1",
        "Star - Purple",
        "Star - Yellow"
      ]
    });
    this.starfieldMid = this.generateStars({
      placement: "mid",
      numberOfStars: 100,
      scale: 0.05,
      spaceBetween: 20,
      images: ["Star - White - 1"]
    });
    this.starfieldFront = this.generateStars({
      placement: "front",
      numberOfStars: 50,
      scale: 0.1,
      spaceBetween: 40,
      images: ["Star - White - 2"]
    });

    /* Create a group of starfields to make looping all cleaner */
    this.starfields = [
      this.starfieldBack,
      this.starfieldMid,
      this.starfieldFront
    ];

    this.starfields.forEach((starfield, i) => {
      /* Set the starting location for each star */
      starfield.children.each(star => {
        star.x = star.x -= this.screenWidth / 2;
        star.y = star.y -= this.screenHeight / 2;
        star.alpha = 1;
      });
    });
  }

  update() {
    // Scroll background with player movement
    this.paralaxStars();
  }
}

export default Stars;
