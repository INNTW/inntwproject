"use client";

const MAX_CONCURRENT = 4;
const MIN_INTERVAL_MS = 30;
const PLAY_PROBABILITY = 0.35;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private buffers: AudioBuffer[] = [];
  private _initialized = false;
  private _volume = 0.5;
  private _muted = false;
  private activeCount = 0;
  private lastPlayTime = 0;

  get initialized() {
    return this._initialized;
  }

  async initialize(): Promise<void> {
    if (this._initialized) return;
    try {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this._muted ? 0 : this._volume;
      this.gainNode.connect(this.ctx.destination);
      this.buffers = [
        this.generateClack(0.025, 1200, 0.6),
        this.generateClack(0.030, 900, 0.5),
        this.generateClack(0.020, 1500, 0.55),
        this.generateClack(0.035, 700, 0.4),
      ];
      this._initialized = true;
    } catch (e) {
      console.warn("Audio initialization failed:", e);
    }
  }

  private generateClack(duration: number, frequency: number, intensity: number): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 200) * intensity;
      const noise = (Math.random() * 2 - 1) * 0.7;
      const click = Math.sin(2 * Math.PI * frequency * t) * 0.15;
      const hp = Math.sin(2 * Math.PI * (frequency * 2.5) * t) * 0.1;
      data[i] = (noise + click + hp) * envelope;
    }
    return buffer;
  }
  playClack(variation?: number): boolean {
    if (!this.ctx || !this.gainNode || this._muted) return false;
    const now = performance.now();
    if (now - this.lastPlayTime < MIN_INTERVAL_MS) return false;
    if (this.activeCount >= MAX_CONCURRENT) return false;
    if (Math.random() > PLAY_PROBABILITY) return false;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer =
        this.buffers[(variation ?? Math.floor(Math.random() * this.buffers.length)) % this.buffers.length];
      source.playbackRate.value = 0.85 + Math.random() * 0.3;
      source.connect(this.gainNode);
      source.start(this.ctx.currentTime);
      this.activeCount++;
      this.lastPlayTime = now;
      source.onended = () => {
        this.activeCount = Math.max(0, this.activeCount - 1);
      };
      return true;
    } catch {
      return false;
    }
  }

  setVolume(vol: number): void {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && !this._muted) {
      this.gainNode.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.01);
    }
  }
  setMuted(muted: boolean): void {
    this._muted = muted;
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(muted ? 0 : this._volume, this.ctx!.currentTime, 0.01);
    }
  }
}

export const audioEngine = new AudioEngine();