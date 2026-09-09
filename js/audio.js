/**
 * KAVASAM - Tactical Mission Control Web Audio Synthesizer
 * Zero-dependency audio feedback for emergency operations center experience
 */

class KavasamAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Enabled by default, muted if user toggles
    this.initialized = false;
  }

  init() {
    if (!this.initialized && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playTacticalChime(660, 0.08);
    }
    return this.enabled;
  }

  playTone(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }

  playTacticalChime(freq = 520, duration = 0.12) {
    this.playTone(freq, 'sine', duration, 0.05);
  }

  playAlertTone() {
    if (!this.enabled) return;
    this.playTone(784, 'triangle', 0.12, 0.09);
    setTimeout(() => this.playTone(659, 'sine', 0.2, 0.07), 110);
  }

  playCriticalWarning() {
    if (!this.enabled) return;
    this.playTone(880, 'sawtooth', 0.1, 0.06);
    setTimeout(() => this.playTone(880, 'sawtooth', 0.1, 0.06), 140);
  }

  playSuccessBeep() {
    if (!this.enabled) return;
    this.playTone(523.25, 'sine', 0.08, 0.06); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.06), 90); // E5
  }

  playRecalculatingSweep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

window.kavasamAudio = new KavasamAudio();
