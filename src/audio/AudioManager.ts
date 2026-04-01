/**
 * AudioManager handles all audio playback using Tone.js for sample-accurate timing.
 * Loads audio files into Tone.Buffers for instant playback.
 */

import * as Tone from 'tone';

export class AudioManager {
  private buffers: Map<string, Tone.ToneAudioBuffer> = new Map();
  private players: Map<string, Tone.Player> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    await Tone.start();
    this.isInitialized = true;
  }

  async loadBuffer(name: string, url: string): Promise<void> {
    if (this.buffers.has(name)) return;
    try {
      // Fetch the audio file and decode it using Web Audio API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // Decode the audio data using the Tone.js context
      const audioBuffer = await Tone.ToneAudioBuffer.fromUrl(
        URL.createObjectURL(new Blob([arrayBuffer], { type: 'audio/mpeg' }))
      );
      this.buffers.set(name, audioBuffer);

      // Keep a pre-created player to avoid re-instantiating on every hit, reducing GC churn and latency.
      const player = new Tone.Player(audioBuffer).toDestination();
      player.autostart = false;
      this.players.set(name, player);
    } catch (err) {
      console.warn(`Failed to load audio buffer ${name} from ${url}:`, err);
    }
  }

  playSound(name: string): void {
    const player = this.players.get(name);
    if (!player) {
      console.warn(`Player for ${name} not found`);
      return;
    }

    try {
      if (player.state === 'started') {
        player.stop();
      }
      player.start();
    } catch (err) {
      console.warn(`Error playing sound ${name}:`, err);
    }
  }

  dispose(): void {
    this.buffers.forEach((buffer) => buffer.dispose());
    this.buffers.clear();
    this.players.forEach((player) => player.dispose());
    this.players.clear();
  }
}

export default new AudioManager();
