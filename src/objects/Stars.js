import { GameObjects } from "phaser";
import random from "lodash/random";

class Stars extends GameObjects.TileSprite {
  constructor(scene, { sceneName }) {
    super(scene);
    this.scene = scene;
    this.scene.add.existing(this);

    this.sceneName = sceneName;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.extraWidth = innerWidth * 2;
    this.extraHeight = innerHeight * 2;
    this.screenSpace = window.innerWidth + window.innerHeight;
    this.centerWidth = this.screenWidth / 2;
    this.centerHeight = this.screenHeight / 2;

    if (sceneName === "GameScene") this.createGameStars();
    if (sceneName === "MenuScene") this.ceateMenuStars();

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
          index = random(0, images.length);
        }

        /* Generate a new star image */
        let newStar = this.scene.add.image(star.x, star.y, images[index]);
        newStar.alpha = 1;
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
    const midDamper = 0.0175;
    const frontDamper = 0.02;

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

  animateStars() {
    const { averageAmplitude = 0.3 } = this.scene.musicManager;
    /* Use the average amplitude to set opacity */
    this.starfields.forEach((starfield, i) => {
      /* i === starfield | 0 = back | 1 = mid | 2 = front */
      starfield.children.each(star => {
        if (i === 0) star.scale = averageAmplitude + starfield.baseScale + 0.02;
        if (i === 1) star.scale = averageAmplitude + starfield.baseScale + 0.03;
        if (i === 2) star.scale = averageAmplitude + starfield.baseScale + 0.05;
        if (averageAmplitude < 0.3) {
          star.alpha = 0.5;
        } else {
          star.alpha = averageAmplitude + 0.2;
        }
      });
    });
  }

  createGameStars() {
    /* Randomly generate starfield */
    /* numberOfStars * spaceBetween must be less than screenSpace */
    this.starfieldBack = this.generateStars({
      placement: "back",
      numberOfStars: 250,
      scale: 0.01,
      spaceBetween: 20,
      images: [
        "Star - White - 1",
        "Star - White - 2",
        "Star - Blue - 1",
        "Star - Purple",
        "Star - Yellow",
        "Star - Red"
      ]
    });
    this.starfieldMid = this.generateStars({
      placement: "mid",
      numberOfStars: 100,
      scale: 0.03,
      spaceBetween: 20,
      images: ["Star - White - 1", "Star - White - 2"]
    });
    this.starfieldFront = this.generateStars({
      placement: "front",
      numberOfStars: 25,
      scale: 0.06,
      spaceBetween: 40,
      images: ["Star - White - 1", "Star - White - 2"]
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

    /* Create Nebulas */
    this.createNebulas();
  }

  ceateMenuStars() {
    this.menuStars = this.generateStars({
      placement: "back",
      numberOfStars: 300,
      scale: 1,
      spaceBetween: 20,
      images: [
        "Star - White - 1",
        "Star - White - 2",
        "Star - Blue - 1",
        "Star - Purple",
        "Star - Yellow",
        "Star - Red"
      ]
    });

    this.menuStars.children.each(star => {
      star.alpha = 1;
      star.y = star.y -= this.screenHeight * 2;
      star.speed = random(2, 6);
    });
  }

  animateMenu() {
    const { averageAmplitude = 0.3 } = this.scene.musicManager;

    this.menuStars.children.each(star => {
      star.y += star.speed;
    });

    // /* Use the average amplitude to set opacity */
    // this.starfields.forEach((starfield, i) => {
    //   /* i === starfield | 0 = back | 1 = mid | 2 = front */
    //   starfield.children.each(star => {
    //     if (i === 0) star.scale = averageAmplitude + starfield.baseScale + 0.02;
    //     if (i === 1) star.scale = averageAmplitude + starfield.baseScale + 0.03;
    //     if (i === 2) star.scale = averageAmplitude + starfield.baseScale + 0.05;

    //     if (averageAmplitude < 0.3) {
    //       star.alpha = 0.5;
    //     } else {
    //       star.alpha = averageAmplitude + 0.2;
    //     }
    //   });
    // });
  }

  createNebulas() {
    const { screenWidth, screenHeight } = this;
    const nebulaAmount = 12;
    const nebulaNames = [
      "NebulaOne",
      "NebulaTwo",
      "NebulaThree",
      "NebulaFour",
      "NebulaSix"
    ];

    this.nebulas = [];
    for (let i = 0; i < nebulaAmount; i++) {
      this.nebulas.push(
        this.scene.add.image(
          random(-125, screenWidth),
          random(-125, screenHeight),
          nebulaNames[random(0, nebulaNames.length)]
        )
      );
    }

    this.nebulas.forEach(nebula => {
      const minScale = 0.4;
      const maxScale = 0.8;
      nebula.scale = random(minScale, maxScale);
      nebula.rotation = random(0, 360);
      nebula.alpha = 0.3;
    });
  }

  paralaxNebulas() {
    const { x, y } = this.scene.player.body.velocity;
    const { nebulas } = this;
    const damper = 0.013; //0.0125;

    /* Paralax Nebulas if the player moves on the X axis */

    if (x !== 0) {
      nebulas.forEach(nebula => {
        nebula.x -= x * damper;
      });
    }

    if (y !== 0) {
      nebulas.forEach(nebula => {
        nebula.y -= y * damper;
      });
    }
  }

  animateNebulas() {
    const { nebulas } = this;
    const { averageAmplitude = 0.3 } = this.scene.musicManager;
    const minAlpha = 0.2;
    const maxAlpha = 0.5;

    if (averageAmplitude < minAlpha) {
      nebulas.forEach(nebula => {
        nebula.alpha = minAlpha;
      });
    } else if (averageAmplitude > maxAlpha) {
      nebulas.forEach(nebula => {
        nebula.alpha = maxAlpha;
      });
    } else {
      nebulas.forEach(nebula => {
        nebula.alpha = averageAmplitude;
      });
    }
  }

  update() {
    if (this.sceneName === "GameScene") {
      /* Scroll background with player movement */
      this.paralaxStars();

      /* Animate Stars */
      this.animateStars();

      /* Paralax Nebulas */
      this.paralaxNebulas();

      /* Animate Nebulas */
      this.animateNebulas();
    }
    if (this.sceneName === "MenuScene") {
      this.animateMenu();
    }
  }
}

export default Stars;
