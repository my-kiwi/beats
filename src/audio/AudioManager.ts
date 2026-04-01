/**
 * AudioManager handles all audio playback using Tone.js for sample-accurate timing.
 * Loads audio files into Tone.Buffers for instant playback.
 */

import * as Tone from 'tone';

export class AudioManager {
  private buffers: Map<string, Tone.ToneAudioBuffer> = new Map();
  private players: Map<string, Tone.Player[]> = new Map();
  private playerIndex: Map<string, number> = new Map();
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

      // Polyphonic pool: multiple players for overlapping hits (true polyphony)
      const poolSize = 4;
      const pool: Tone.Player[] = [];
      for (let i = 0; i < poolSize; i += 1) {
        const player = new Tone.Player(audioBuffer).toDestination();
        player.autostart = false;
        pool.push(player);
      }
      this.players.set(name, pool);
      this.playerIndex.set(name, 0);
    } catch (err) {
      console.warn(`Failed to load audio buffer ${name} from ${url}:`, err);
    }
  }

  playSound(name: string): void {
    const pool = this.players.get(name);
    if (!pool || pool.length === 0) {
      console.warn(`Player pool for ${name} not found`);
      return;
    }

    try {
      const index = this.playerIndex.get(name) ?? 0;
      const player = pool[index];
      const nextIndex = (index + 1) % pool.length;
      this.playerIndex.set(name, nextIndex);

      // Do not stop old sounds; allow overlapping playback for polyphony.
      player.start();
    } catch (err) {
      console.warn(`Error playing sound ${name}:`, err);
    }
  }

  dispose(): void {
    this.buffers.forEach((buffer) => buffer.dispose());
    this.buffers.clear();
    this.players.forEach((player) => player.forEach((p) => p.dispose()));
    this.players.clear();
  }
}

export default new AudioManager();
