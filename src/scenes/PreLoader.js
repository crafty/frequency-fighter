import { Scene } from "phaser";

export default class PreLoader extends Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    /* Set Scene Background Color */
    this.cameras.main.setBackgroundColor("#131112");

    /* Loading Information */
    const { width, height } = this.game.renderer;

    this.progressBox = this.add
      .graphics()
      .fillStyle(0x2a3036)
      .fillRect(width / 2 - 180, height / 2 - 25, 360, 50);
    this.progressBar = this.add.graphics();

    this.loadingText = this.make
      .text({
        x: width / 2,
        y: height / 2 - 50,
        text: "",
        style: {
          font: "28px Monogram",
          fill: "#EBECE8"
        }
      })
      .setOrigin(0.5, 0.5);

    this.percentText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "0%",
        style: {
          font: "24px Monogram",
          fill: "#FEFEFF"
        }
      })
      .setOrigin(0.5, 0.5);

    this.assetText = this.make
      .text({
        x: width / 2,
        y: height / 2 + 50,
        text: "",
        style: {
          font: "24px Monogram",
          fill: "#FEFEFF"
        }
      })
      .setOrigin(0.5, 0.5);

    this.nameText = this.make
      .text({
        x: width / 2,
        y: height - 50,
        text: "",
        style: {
          font: "24px Monogram",
          fill: "#e75a7c"
        }
      })
      .setOrigin(0.5, 0.5);

    this.load.on("progress", value => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xe75a7c);
      this.progressBar.fillRect(
        width / 2 - 170,
        height / 2 - 15,
        340 * value,
        30
      ); // 10 width 10 height
      this.percentText.setText(`${parseInt(value * 100)}%`);
    });

    this.load.on("fileprogress", file => {
      this.assetText.setText(`Asset: ${file.key}.${file.type}`);
      this.loadingText.setText(`LOADING...`);
      this.nameText.setText(`dancraycraft.dev`);
    });

    this.bump = this.tweens.add({
      targets: [this.loadingText, this.assetText],
      scale: { from: 1.3, to: 1 },
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 675,
      repeat: -1, // -1: infinity
      yoyo: false
    });

    this.load.on("complete", () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });

    /* Preload Game Assets */
    this.load.pack("packOne", this.cache.json.get("assets"));
  }

  create() {
    this.scene.start("Menu");
  }
}
