/**
 * Sequencer manages the timing and step progression of the loop using Tone.js.
 * It notifies listeners when each step is reached with sample-accurate timing.
 */

import * as Tone from 'tone';

export interface SequencerListener {
  onStep(stepIndex: number): void;
}

export class Sequencer {
  private loop: Tone.Loop | undefined;
  private currentStepValue: number = -1;
  private bpm: number = 50;
  private totalSteps: number = 16;
  private listeners: Set<SequencerListener> = new Set();

  constructor(totalSteps: number = 16, bpm: number = 50) {
    this.totalSteps = totalSteps;
    this.bpm = bpm;
    Tone.Transport.bpm.value = bpm;
  }

  get currentStep(): number {
    return this.currentStepValue;
  }

  get isRunning(): boolean {
    return Tone.Transport.state === 'started';
  }

  setBpm(bpm: number) {
    this.bpm = bpm;
    Tone.Transport.bpm.value = bpm;
  }

  subscribe(listener: SequencerListener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener: SequencerListener) {
    this.listeners.delete(listener);
  }

  start() {
    if (this.isRunning) return;

    if (!this.loop) {
      let idx = 0;
      this.loop = new Tone.Loop(() => {
        this.currentStepValue = idx;
        this.notifyListeners(idx);
        idx = (idx + 1) % this.totalSteps;
      }, '16n'); // 16th note timing
      this.loop.start(0);
    }

    Tone.Transport.start();
  }

  stop() {
    if (!this.isRunning) return;
    Tone.Transport.stop();
    this.currentStepValue = -1;
    this.notifyListeners(-1);
  }

  private notifyListeners(stepIndex: number) {
    this.listeners.forEach((listener) => {
      listener.onStep(stepIndex);
    });
  }
}

export default Sequencer;
