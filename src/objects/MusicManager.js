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

    /* Lots of Smoothing, The below 3 items are to help the changes in data be less dramatic, smoothingTimeConstant overlaps values in the data arrays */
    this.analyzerNode.smoothingTimeConstant = 0.5;
    this.analyzerNode.fftSize = 1024; // 512 2048(default)

    this.bufferLength = this.analyzerNode.frequencyBinCount; // frequencyBinCount = half the fftSize

    this.freqTimeData = new Uint8Array(this.bufferLength);
    this.freqByteData = new Uint8Array(this.bufferLength);
  }

  byteToNormalizedFloat(srcArray, dstArray) {
    /* Converts bytes to normalized (0 <-> 1) floats */
    const sum = srcArray.reduce((pV, cV) => (pV += cV / 255));
    srcArray.forEach((point, index) => {
      dstArray[index] = sum / srcArray.length;
    });
  }

  update() {
    /* ============ NOTES ============ */
    /* Setting opacity based on feqByteData */
    /* Byte values range between 0 - 255, that maps to -1 <=> +1, s0 128 = 0 */
    /* getFloatFrequencyData returns dB, getByteFrequencyData maps based on min/max decibels */
    /* Must use Float32Array instead of Unit8Array for Float arrays */
    /* Amplitude = sum of freqByteData / (this.bufferLength * 256 - 1); */
    /* ============ NOTES ============ */

    /* Update Current Time Of Song */
    this.time = this.analyzerNode.context.currentTime;

    /* Update the AnalyzerNodes Data */
    //this.analyzerNode.getByteTimeDomainData(this.freqTimeData);
    this.analyzerNode.getByteFrequencyData(this.freqByteData);

    /* Create a float 32 array */
    this.floatArray = new Float32Array(this.bufferLength);

    /* Convert the byte data to normalized(0 - 1 values) Float32Array */
    this.byteToNormalizedFloat(this.freqByteData, this.floatArray);

    /* Filters 0's out of the float array */
    this.floatArray = this.floatArray.filter(value => value !== 0);

    /* Get the average of the normalized data */
    /* If the foatArray has values */
    if (this.floatArray.length > 0) {
      let average =
        this.floatArray.reduce((pV, cV) => (pV += cV)) / this.floatArray.length;

      /* Add dd to the average if you want a higher normalized value */
      average += 0.3;

      console.log(average);

      /* Use the average to set opacity */
      this.scene.stars.starfieldFront.alpha = average;
      this.scene.stars.starfieldMid.alpha = average;
    }
  }
}

export default MusicManager;
