/**
 * @param {number} volume
 * @returns {number}
 */

export const normalizeVolume = (volume) => {
  return Math.min(1, Math.max(0, volume));
};

/**
 * @returns {AudioContext}
 */
export const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

/**
 * @param {HTMLAudioElement} audioElement
 * @param {number} duration
 * @param {string} direction
 */

export const fadeAudio = (audioElement, duration = 1000, direction = "out") => {
  const fadeSteps = 20;
  const stepTime = duration / fadeSteps;
  const volumeStep = 1 / fadeSteps;
  let currentStep = 0;

  const fadeInterval = setInterval(() => {
    if (direction === "out") {
      currentStep++;
      audioElement.volume = Math.max(0, 1 - volumeStep * currentStep);
    } else {
      currentStep++;
      audioElement.volume = Math.min(1, volumeStep * currentStep);
    }

    if (currentStep >= fadeSteps) {
      clearInterval(fadeInterval);
      if (direction === "out") {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.volume = 1;
    } }
  }, stepTime);

  return () => clearInterval(fadeInterval);
};