/**
 * Sequencer manages the timing and step progression of the loop.
 * It notifies listeners when each step is reached.
 */

import { PadButton } from '../pads/Pad';

export interface SequencerListener {
  onStep(stepIndex: number): void;
}

export class Sequencer {
  private loopId: number | undefined;
  private currentStepValue: number = -1;
  private bpm: number = 50;
  private totalSteps: number = 16;
  private listeners: Set<SequencerListener> = new Set();

  constructor(totalSteps: number = 16, bpm: number = 50) {
    this.totalSteps = totalSteps;
    this.bpm = bpm;
  }

  get currentStep(): number {
    return this.currentStepValue;
  }

  get isRunning(): boolean {
    return this.loopId !== undefined;
  }

  setBpm(bpm: number) {
    this.bpm = bpm;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  subscribe(listener: SequencerListener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener: SequencerListener) {
    this.listeners.delete(listener);
  }

  start() {
    if (this.loopId) return; // already running

    const msPerStep = Math.round(60000 / this.bpm / 4);
    let idx = 0;

    this.loopId = window.setInterval(() => {
      this.currentStepValue = idx;
      this.notifyListeners(idx);
      idx = (idx + 1) % this.totalSteps;
    }, msPerStep);
  }

  stop() {
    PadButton.instances.forEach((p) => p.setPlaying(false));
    if (this.loopId) {
      clearInterval(this.loopId);
      this.loopId = undefined;
      this.currentStepValue = -1;
      this.notifyListeners(-1);
    }
  }

  private notifyListeners(stepIndex: number) {
    this.listeners.forEach((listener) => {
      listener.onStep(stepIndex);
    });
  }
}

export default Sequencer;
