import { GameObjects } from "phaser";

class Stars extends GameObjects.TileSprite {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.create();
    console.log(this);
  }

  generateStars({ numberOfStars, starSize, spaceBetween }) {
    /* Generate Random Circles (Star Test) On Screen */
    let starField = this.scene.add.graphics({
      fillStyle: { color: 0xfaf9f9 }
    });

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
        const newStar = new Phaser.Geom.Circle(star.x, star.y, star.r);
        starField.fillCircleShape(newStar);
      }
      counter++;
    }
    return starField;
  }

  paralaxStars() {
    const { x, y } = this.scene.player.body.velocity;
    const { starfieldBack, starfieldMid, starfieldFront } = this;
    const backDamper = 90;
    const midDamper = 60;
    const frontDamper = 30;

    /* Paralax stars if the player moves on the X axis */
    if (x !== 0) {
      starfieldBack.x -= x / backDamper;
      starfieldMid.x -= x / midDamper;
      starfieldFront.x -= x / frontDamper;
    }
    /* Paralax stars if the player moves on the Y axis */
    if (y !== 0) {
      starfieldBack.y -= y / backDamper;
      starfieldMid.y -= y / midDamper;
      starfieldFront.y -= y / frontDamper;
    }
  }

  create() {
    /* Randomly generate starfield */
    this.starfieldBack = this.generateStars({
      numberOfStars: 70,
      starSize: 2,
      spaceBetween: 100
    });
    this.starfieldMid = this.generateStars({
      numberOfStars: 40,
      starSize: 6,
      spaceBetween: 80
    });
    this.starfieldFront = this.generateStars({
      numberOfStars: 20,
      starSize: 80,
      spaceBetween: 60
    });

    this.starfields = [
      this.starfieldBack,
      this.starfieldMid,
      this.starfieldFront
    ];

    this.starfields.forEach((starfield, i) => {
      /* Set the starting location of the starfield */
      starfield.x = -window.innerWidth / 2;
      starfield.y = -window.innerHeight / 2;
      /* Set the opacity of the starfield */
      if (i === 0) starfield.alpha = 0.6;
      if (i === 1) starfield.alpha = 0.8;
    });

    this.starfieldBack.generateTexture();
  }

  update() {
    // Scroll background with player movement
    this.paralaxStars();
  }
}

export default Stars;
