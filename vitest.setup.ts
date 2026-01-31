/**
 * Vitest setup file to mock Tone.js in test environment
 */

import { vi } from 'vitest';

vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  ToneAudioBuffer: {
    fromUrl: vi.fn().mockResolvedValue({
      dispose: vi.fn(),
    }),
  },
  Transport: {
    bpm: { value: 50 },
    state: 'stopped',
    start: vi.fn(),
    stop: vi.fn(),
  },
  Loop: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
  })),
  Player: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    start: vi.fn(),
    dispose: vi.fn(),
  })),
}));

vi.mock('./src/audio/AudioManager', () => ({
  default: {
    initialize: vi.fn().mockResolvedValue(undefined),
    loadBuffer: vi.fn().mockResolvedValue(undefined),
    playSound: vi.fn(),
  },
}));
