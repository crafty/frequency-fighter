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
    scene.sound.play("In The Summer", { volume: 0.2 }); // In The Summer Fireman
    scene.sound.context.createAnalyser();
    /* 
      Audio Analyser 
    */
    this.analyzerNode = scene.sound.context.createAnalyser();
    this.analyzerNode.audioBuffer = scene.sound.sounds[0].source.buffer;
    this.analyzerNode.duration = scene.sound.sounds[0].source.buffer.duration;
    this.analyzerNode.source = scene.sound.sounds[0].source;
    this.analyzerNode.source.connect(this.analyzerNode);

    /* Smoothing and points of data per sample, The below 3 items are to help the changes in data be less dramatic, smoothingTimeConstant overlaps values in the data arrays */
    /* Modify these to greatly effects the accuracy of the byte data */
    this.analyzerNode.smoothingTimeConstant = 0.5;
    this.analyzerNode.fftSize = 1024; // 512 1024 2048(default)

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

      /* Use the average to set opacity */
      this.scene.stars.starfields.forEach((starfield, i) => {
        starfield.children.each(star => {
          /* Add dd to the average if you want a higher normalized value */
          star.scale = average + 0.8;

          /* Check if the for threshold and mid/front starfield */
          if (average > 0.6 && i !== 0) {
            star.alpha = average + 0.2;
          } else {
            star.alpha = 0.5;
          }
        });
      });
    }
  }
}

export default MusicManager;
