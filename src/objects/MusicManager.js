class MusicManager {
  constructor(scene) {
    this.scene = scene;
    this.analyzerNode;
    this.freqTimeData;
    this.freqByteData;
    this.bufferLength;
    this.source;
    this.time;
    this.visualizationAccuracy = 2048; // 512 1024 2048(default) | I will pass this in from a settings option later.

    this.create();
    console.log(this);
  }

  create() {
    const { scene } = this;

    /* Start the song so we have an audio source as an input for nodes */
    scene.sound.play("In The Summer", { volume: 0.05 }); // In The Summer | Fireman | Home
    scene.sound.context.createAnalyser();
    /* 
      Audio Analyser Node Setup
    */
    this.analyzerNode = scene.sound.context.createAnalyser();
    this.analyzerNode.audioBuffer = scene.sound.sounds[0].source.buffer;
    this.analyzerNode.duration = scene.sound.sounds[0].source.buffer.duration;
    this.analyzerNode.source = scene.sound.sounds[0].source;
    this.analyzerNode.source.connect(this.analyzerNode);

    /* fftSize / 2 equals the amount of data points per sample */
    /* Smoothing overlaps values in the data arrays */
    /* Modify these to greatly effect the accuracy and smoothness of visualations */
    this.analyzerNode.smoothingTimeConstant = 0.5;
    this.analyzerNode.fftSize = this.visualizationAccuracy;

    this.bufferLength = this.analyzerNode.frequencyBinCount; // frequencyBinCount = half the fftSize

    this.freqTimeData = new Uint8Array(this.bufferLength);
    this.freqByteData = new Uint8Array(this.bufferLength);
  }

  byteToNormalizedFloat(srcArray, dstArray) {
    /* Converts bytes to normalized (0 <-> 1)ish floats */
    const sum = srcArray.reduce((pV, cV) => (pV += cV / 255));
    srcArray.forEach((point, index) => {
      dstArray[index] = sum / srcArray.length;
    });
  }

  update() {
    /* ============ NOTES ============ */
    /* Byte values range between 0 - 255, that maps to -1 <=> +1, s0 128 = 0 */
    /* getFloatFrequencyData returns dB, getByteFrequencyData maps based on min/max decibels set on node */
    /* Must use Float32Array instead of Unit8Array for Float arrays */
    /* Amplitude = sum of freqByteData (freq / 255) / this.bufferLength  */
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

    /* Filters 0's out of the float array. Doing this seems to create more accurate/steady visuals */
    this.floatArray = this.floatArray.filter(value => value !== 0);

    /* Get the average of the normalized data */
    /* If the floatArray has values do stuff, prevents a bug */
    if (this.floatArray.length > 0) {
      let average =
        this.floatArray.reduce((pV, cV) => (pV += cV)) / this.floatArray.length;

      /* Use the average to set opacity */
      /* Add to the average if you want a higher normalized value */
      this.scene.stars.starfields.forEach((starfield, i) => {
        /* i === starfield | 0 = back | 1 = mid | 2 = front */
        starfield.children.each(star => {
          if (i === 0) star.scale = average + starfield.baseScale + 0.05;
          if (i === 1) star.scale = average + starfield.baseScale + 0.1;
          if (i === 2) star.scale = average + starfield.baseScale + 0.2;

          if (average < 0.3) {
            star.alpha = 0.5;
          } else {
            star.alpha = average + 0.2;
          }
        });
      });

      /* Set Player glow Values based on beat */
      this.scene.player.glow.setAlpha(average);
    }
  }
}

export default MusicManager;
