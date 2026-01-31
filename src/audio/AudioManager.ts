/**
 * AudioManager handles all audio playback using Tone.js for sample-accurate timing.
 * Loads audio files into Tone.Buffers for instant playback.
 */

import * as Tone from 'tone';

export class AudioManager {
  private buffers: Map<string, Tone.ToneAudioBuffer> = new Map();
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
    } catch (err) {
      console.warn(`Failed to load audio buffer ${name} from ${url}:`, err);
    }
  }

  playSound(name: string): void {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Buffer ${name} not found`);
      return;
    }

    try {
      const player = new Tone.Player(buffer).toDestination();
      player.start();
    } catch (err) {
      console.warn(`Error playing sound ${name}:`, err);
    }
  }

  dispose(): void {
    this.buffers.forEach((buffer) => buffer.dispose());
    this.buffers.clear();
  }
}

export default new AudioManager();
