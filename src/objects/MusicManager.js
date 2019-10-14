import RealTimeBPMAnalyzer from 'realtime-bpm-analyzer';
//const Tone = require("Tone");

class MusicManager {
  constructor(scene) {
    //super(scene);
    this.scene = scene;
    this.analyzerNode;
    this.dataArray;
    this.bufferLength;
    this.time;

    this.create();
    console.log(this);
  }

  create() {
    const { scene } = this;
    const { context } = scene.sound;
    const { destination } = context;

    /* Start the song so we have an audio source as an input for nodes */
    scene.sound.play('drake', { loop: true, volume: 0 });

    /* 
      Audio Analyser 
    */
    this.analyzerNode = scene.sound.context.createAnalyser();

    this.source = scene.sound.sounds[0].source.connect(this.analyzerNode);

    /* The below 3 items are to help the changes in data be less dramatic, smoothingTimeConstant overlaps values in the data arrays */
    this.analyzerNode.minDecibels = -90;
    this.analyzerNode.maxDecibels = -10;
    this.analyzerNode.smoothingTimeConstant = 1;

    this.bufferLength = this.analyzerNode.frequencyBinCount; // buffer is half the fft | default is 2048

    this.dataArray = new Uint8Array(this.bufferLength); // To retrieve the data call the data collection method getByteTimeDomainData

    this.graphics = scene.add.graphics();

    /*
      Audio Tempo Processor
    */
    this.onAudioProcess = new RealTimeBPMAnalyzer({
      scriptNode: {
        bufferSize: 4096,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1,
      },
      pushTime: 2000,
      pushCallback: (err, bpm) => {
        // if (err) console.log(err);
        // console.log("bpm", bpm);
      },
    });

    const scriptProcessorNode = scene.sound.context.createScriptProcessor(
      4096,
      1,
      1
    );

    scriptProcessorNode.connect(destination);
    scene.sound.sounds[0].source.connect(scriptProcessorNode);

    scriptProcessorNode.onaudioprocess = e => {
      this.onAudioProcess.analyze(e);
    };

    /* Delay Time in ms for quarter-note beats */
    const msPerMinute = 60000; // 60,000 ms (1 minute)
    const zeroToOneHundredBPM = 96; // Tempo (BPM)
    const delayTime = msPerMinute / zeroToOneHundredBPM; // Tempo-Sync Echo Delay Time

    /* 
      Tone Transport | Time Keeping 
    */
    // Transport.scheduleRepeat(function(time) {
    //   //do something with the time                  HETRERE TONE TRANSPORT LEFT OFF
    //   console.log("test");
    //   //this.scene.sound.play("tock", { volume: 1.5 });
    // }, "8n");
  }

  generateStars(points) {
    /* Generate Random Circles (Star Test) On Screen */
    this.graphic = this.scene.add.graphics({ fillStyle: { color: 0xfaf9f9 } });
    this.starSize = 10;
    let points = [];

    for (var i = 0; i < 100; i++) {
      const { x, y } = this.generateStars(points);
      points.push(new Phaser.Geom.Circle(x, y, this.starSize));
    }

    points.forEach(point => {
      this.graphic.fillCircleShape(point);
    });

    this.graphic.setAlpha(0.2);

    // let x;
    // points.forEach(cords => {
    //   let tempX = Math.floor(Math.random() * window.innerWidth);
    //   if (tempX < cords.x + 20 && tempX > cords.x - 20) {
    //     tempX = Math.floor(Math.random() * window.innerWidth);
    //   }
    //   x = tempX;
    // });
    // let y;
    // points.forEach(cords => {
    //   let tempY = Math.floor(Math.random() * window.innerHeight);
    //   if (tempY < cords.y + 20 && tempY > cords.y - 20) {
    //     tempY = Math.floor(Math.random() * window.innerHeight);
    //   }
    //   y = tempY;
    // });

    // points.forEach(cords => {
    //   if (cords.x === x && cords.y === y) {
    //     x = Math.floor(Math.random() * window.innerWidth);
    //     y = Math.floor(Math.random() * window.innerHeight);
    //   }
    // });

    //let y;
    //const possibleYpoints = points.map(cords => cords.y);

    //let x;
    //const possibleXpoints = points.map(cords => cords.x);

    // x = Math.floor(Math.random() * window.innerWidth);
    // y = Math.floor(Math.random() * window.innerHeight);

    // let overlaping = false;
    // points.forEach(cords => {
    //   if (x === cords.x) {
    //     console.log('overlap x: ', x, cords.x);
    //     x += 20
    //   }
    // });

    // do {
    //   let x = Math.floor(Math.random() * window.innerWidth);
    // } while (possibleXpoints.every(cord => x < cord + 20 && x > cord - 20));

    //console.log(possibleXpoints.every(cord => x < cord + 20 && x > cord - 20));

    // do {
    //   y = Math.floor(Math.random() * window.innerHeight);
    // } while (possibleYpoints.some(cord => y < cord + 10 && y > cord - 10));

    return { x, y };
  }

  update() {
    /* Update Current Time Of Song */
    this.time = this.analyzerNode.context.currentTime;

    /* Update the AnalyzerNodes Data */
    this.time = this.analyzerNode.getByteTimeDomainData(this.dataArray);

    let average = Math.round(
      this.dataArray.reduce((pV, cV) => (pV += cV)) / this.dataArray.length
    );
    //console.log('Average: ', average);

    /* Setting opacity based on dataArray */
    for (let i = 0; i < this.bufferLength; i++) {
      // if (i % 2 === 0) {} Cut the amount of times it updates the opacity in half
      let opacity = 0.5;
      let value = this.dataArray[i] / 128;

      if (value > 1.2) opacity = 1;
      if (value < 1.2 && value > 0.8) opacity = 0.8;
      if (value < 0.8 && value > 0.5) opacity = 0.5;
      if (value < 0.5 && value > 0.3) opacity = 0.3;
      if (value < 0.3) opacity = 0.1;

      this.graphic.setAlpha(opacity);
    }
  }
}

export default MusicManager;
