import RealTimeBPMAnalyzer from "realtime-bpm-analyzer";
//const Tone = require("Tone");

class MusicManager {
  constructor(scene) {
    //super(scene);
    this.scene = scene;
    this.analyzerNode;
    this.dataArray;
    this.bufferLength;

    this.create();
    console.log(this);
  }

  create() {
    const { scene } = this;
    const { context } = scene.sound;
    const { destination } = context;

    /* Start the song so we have an audio source as an input for nodes */
    scene.sound.play("drake", { loop: true, volume: 0 });

    /* 
      Audio Analyser 
    */
    this.analyzerNode = scene.sound.context.createAnalyser();

    scene.sound.sounds[0].source.connect(this.analyzerNode);

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
        numberOfOutputChannels: 1
      },
      pushTime: 2000,
      pushCallback: (err, bpm) => {
        // if (err) console.log(err);
        // console.log("bpm", bpm);
      }
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

    /* Generate Random Circles (Star Test) On Screen */
    this.graphic = this.scene.add.graphics({ fillStyle: { color: 0xfaf9f9 } });
    let points = [];
    for (var i = 0; i < 100; i++) {
      let x = Math.floor(Math.random() * window.innerWidth);
      let y = Math.floor(Math.random() * window.innerHeight);
      points.push(new Phaser.Geom.Circle(x, y, 10));
    }

    points.forEach(point => {
      this.graphic.fillCircleShape(point);
    });

    this.graphic.setAlpha(0.2);
  }

  update() {
    this.analyzerNode.getByteTimeDomainData(this.dataArray);
    // console.log(this.dataArray);

    /* Setting opacity based on dataArray */
    for (let i = 0; i < this.bufferLength; i++) {
      if (i % 2 === 0) {
        let value = this.dataArray[i] / 128;
        let y = value * 300;

        let opacity;
        if (value > 1.2) opacity = 1;
        if (value < 1.2 && value > 0.8) opacity = 0.8;
        if (value < 0.8 && value > 0.5) opacity = 0.5;
        if (value < 0.5 && value > 0.3) opacity = 0.3;
        if (value < 0.3) opacity = 0.1;

        this.graphic.setAlpha(opacity);
      }
    }
  }
}

export default MusicManager;
