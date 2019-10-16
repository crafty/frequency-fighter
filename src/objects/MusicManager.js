/*
const Tone = require("Tone");
const toneAnalyzer = new Tone.Analyser({
  size: 1024,
  type: "fft",
  smoothing: 0.8
});
*/

class MusicManager {
  constructor(scene) {
    //super(scene);
    this.scene = scene;
    this.analyzerNode;
    this.freqTimeData;
    this.freqByteData;
    this.bufferLength;
    this.source;
    this.time;

    this.create();
    console.log(this);
  }

  create() {
    const { scene } = this;

    /* Start the song so we have an audio source as an input for nodes */
    scene.sound.play("queen", { loop: true, volume: 0.3 });
    scene.sound.context.createAnalyser();
    /* 
      Audio Analyser 
    */
    this.analyzerNode = scene.sound.context.createAnalyser();
    this.analyzerNode.audioBuffer = scene.sound.sounds[0].source.buffer;
    this.analyzerNode.duration = scene.sound.sounds[0].source.buffer.duration;
    this.analyzerNode.source = scene.sound.sounds[0].source;
    this.analyzerNode.source.connect(this.analyzerNode);

    /* The below 3 items are to help the changes in data be less dramatic, smoothingTimeConstant overlaps values in the data arrays */
    this.analyzerNode.minDecibels = -90;
    this.analyzerNode.maxDecibels = -10;
    this.analyzerNode.smoothingTimeConstant = 0.8;

    this.bufferLength = this.analyzerNode.frequencyBinCount;

    this.freqTimeData = new Uint8Array(this.bufferLength);
    this.freqByteData = new Uint8Array(this.bufferLength);

    //toneAnalyzer.connect(this.analyzerNode.context);

    /*
      Audio Tempo Processor
    */
    // this.onAudioProcess = new RealTimeBPMAnalyzer({
    //   scriptNode: {
    //     bufferSize: 4096,
    //     numberOfInputChannels: 1,
    //     numberOfOutputChannels: 1
    //   },
    //   pushTime: 2000,
    //   pushCallback: (err, bpm) => {
    //     // if (err) console.log(err);
    //     // console.log("bpm", bpm);
    //   }
    // });

    // const scriptProcessorNode = scene.sound.context.createScriptProcessor(
    //   4096,
    //   1,
    //   1
    // );

    // scriptProcessorNode.connect(destination);
    // scene.sound.sounds[0].source.connect(scriptProcessorNode);

    // scriptProcessorNode.onaudioprocess = e => {
    //   this.onAudioProcess.analyze(e);
    // };

    // /* Delay Time in ms for quarter-note beats */
    // const msPerMinute = 60000; // 60,000 ms (1 minute)
    // const zeroToOneHundredBPM = 96; // Tempo (BPM)
    // const delayTime = msPerMinute / zeroToOneHundredBPM; // Tempo-Sync Echo Delay Time

    /* 
      Tone Transport | Time Keeping 
    */
    // Transport.scheduleRepeat(function(time) {
    //   //do something with the time                  HETRERE TONE TRANSPORT LEFT OFF
    //   console.log("test");
    //   //this.scene.sound.play("tock", { volume: 1.5 });
    // }, "8n");

    /* 
      Beat Detector 
    */
    // analyze(this.analyzerNode.audioBuffer)
    //   .then(tempo => {
    //     console.log("BEAT", tempo);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  update() {
    /* Update Current Time Of Song */
    this.time = this.analyzerNode.context.currentTime;

    /* Update the AnalyzerNodes Data */
    //this.analyzerNode.getByteTimeDomainData(this.freqTimeData);
    this.analyzerNode.getByteFrequencyData(this.freqByteData);

    /* Setting opacity based on feqByteData */
    let average = Math.round(
      this.freqByteData.reduce((pV, cV) => (pV += cV)) /
        this.freqByteData.length
    );

    let percent = average / 100;

    if (percent > 0.85) {
      this.scene.stars.starfieldFront.alpha = 1;
      this.scene.stars.starfieldMid.alpha = 1;
    } else if (percent < 0.15) {
      this.scene.stars.starfieldFront.alpha = 0.2;
      this.scene.stars.starfieldMid.alpha = 0.2;
    } else {
      console.log(percent);
      this.scene.stars.starfieldFront.alpha = percent;
      this.scene.stars.starfieldMid.alpha = percent;
    }
  }
}

export default MusicManager;
