/**
 * Sequencer manages the timing and step progression of the loop.
 * It notifies listeners when each step is reached.
 */

export interface SequencerListener {
  onStep(stepIndex: number): void;
}

export class Sequencer {
  private _loopId: number | undefined;
  private _currentStep: number = -1;
  private _bpm: number = 50;
  private _totalSteps: number = 16;
  private _listeners: Set<SequencerListener> = new Set();

  constructor(totalSteps: number = 16, bpm: number = 50) {
    this._totalSteps = totalSteps;
    this._bpm = bpm;
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get isRunning(): boolean {
    return this._loopId !== undefined;
  }

  setBpm(bpm: number) {
    this._bpm = bpm;
  }

  subscribe(listener: SequencerListener) {
    this._listeners.add(listener);
  }

  unsubscribe(listener: SequencerListener) {
    this._listeners.delete(listener);
  }

  start() {
    if (this._loopId) return; // already running

    const msPerStep = Math.round(60000 / this._bpm / 4);
    let idx = 0;

    this._loopId = window.setInterval(() => {
      this._currentStep = idx;
      this._notifyListeners(idx);
      idx = (idx + 1) % this._totalSteps;
    }, msPerStep);
  }

  stop() {
    if (this._loopId) {
      clearInterval(this._loopId);
      this._loopId = undefined;
      this._currentStep = -1;
      this._notifyListeners(-1);
    }
  }

  private _notifyListeners(stepIndex: number) {
    this._listeners.forEach((listener) => {
      listener.onStep(stepIndex);
    });
  }
}

export default Sequencer;
