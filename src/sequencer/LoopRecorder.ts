/**
 * LoopRecorder manages step-based recording and playback of pad sequences.
 * It handles toggling pads on/off at specific steps and playing them back.
 */

import { PadButton } from '../pads/Pad';
import { SequencerListener } from './Sequencer';

export class LoopRecorder implements SequencerListener {
  private recordings: Map<number, Set<PadButton>> = new Map();

  recordPadAtStep(pad: PadButton, step: number) {
    if (!this.recordings.has(step)) {
      this.recordings.set(step, new Set());
    }
    const padsAtStep = this.recordings.get(step)!;
    if (padsAtStep.has(pad)) {
      // Already recorded at this step, remove it (toggle off)
      padsAtStep.delete(pad);
    } else {
      // Record this pad at this step
      padsAtStep.add(pad);
    }
    // Update pad visual state based on any recording at any step
    this.updatePadActiveState(pad);
  }

  getRecordingsForStep(step: number): Set<PadButton> {
    return this.recordings.get(step) || new Set();
  }

  clear() {
    this.recordings.clear();
    // Reset active state for all pads
    PadButton.instances.forEach((p) => p.setActive(false));
  }

  private updatePadActiveState(pad: PadButton) {
    // Check if this pad is recorded at any step
    let isRecorded = false;
    for (const pads of this.recordings.values()) {
      if (pads.has(pad)) {
        isRecorded = true;
        break;
      }
    }
    pad.setActive(isRecorded);
  }

  /**
   * Called by Sequencer when a step is reached
   */
  onStep(stepIndex: number) {
    if (stepIndex < 0) {
      // Sequencer stopped, clear current highlights
      PadButton.instances.forEach((p) => {
        p.removeAttribute('current');
        p.setPlaying(false);
      });
      return;
    }

    // Clear all current highlights
    PadButton.instances.forEach((p) => {
      p.removeAttribute('current');
      p.setPlaying(false);
    });

    // Highlight the current step's pad
    const currentPad = PadButton.instances[stepIndex % PadButton.instances.length];
    if (currentPad) {
      currentPad.setAttribute('current', '');
    }

    // Play any recordings at this step
    const recordedPads = this.getRecordingsForStep(stepIndex);
    recordedPads.forEach((p) => {
      p.setPlaying(true);
      p.playAudio();
    });
  }
}

export default LoopRecorder;
