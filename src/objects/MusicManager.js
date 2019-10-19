class MusicManager {
  constructor(scene) {
    this.key = "MusicManager";
    this.scene = scene;
    this.scene.add.existing(this);
    this.analyzerNode;
    this.freqTimeData;
    this.freqByteData;
    this.bufferLength;
    this.source;
    this.time;
    this.averageAmplitude;
    this.visualizationAccuracy = 2048; // 512 1024 2048(default) | I will pass this in from a settings option later.

    console.log(this);
  }

  create(song) {
    console.log(song);
    const { scene } = this;
    /* Start the song so we have an audio source as an input for nodes */
    scene.sound.context.createAnalyser();
    /* 
      Audio Analyser Node Setup
    */
    this.analyzerNode = scene.sound.context.createAnalyser();

    if (song) {
      this.scene.sound.play(song, { volume: 0.3 });
      const { source } = scene.sound.sounds.find(songs => songs.key === song);

      this.analyzerNode.audioBuffer = source.buffer;
      this.analyzerNode.duration = source.buffer.duration;
      this.analyzerNode.source = source;
    } else {
      /* This is only for the main menu */
      this.analyzerNode.audioBuffer = scene.sound.sounds[0].source.buffer;
      this.analyzerNode.duration = scene.sound.sounds[0].source.buffer.duration;
      this.analyzerNode.source = scene.sound.sounds[0].source;
    }

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
    this.analyzerNode.getByteTimeDomainData(this.freqTimeData);
    this.analyzerNode.getByteFrequencyData(this.freqByteData);

    /* Create a float 32 array */
    this.floatArray = new Float32Array(this.bufferLength);

    /* Convert the byte data to normalized(0 - 1 values) Float32Array */
    this.byteToNormalizedFloat(this.freqByteData, this.floatArray);

    /* Filters 0's out of the float array. Doing this seems to create more accurate/steady visuals */
    this.floatArray = this.floatArray.filter(value => value !== 0);

    /* If the floatArray has values do stuff, prevents a bug */
    if (this.floatArray.length > 0) {
      /* Set the average of the normalized data */
      let average =
        this.floatArray.reduce((pV, cV) => (pV += cV)) / this.floatArray.length;
      this.averageAmplitude = average;
    }
  }
}

export default MusicManager;
