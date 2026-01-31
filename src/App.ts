import './GithubLink';
import './pads/PadsGrid';
import { PadButton } from './pads/Pad';

class App extends HTMLElement {
  private _loopId: number | undefined;
  private _currentStep: number = -1;
  private _recordings: Map<number, Set<PadButton>> = new Map();

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <header>
        <h2>Beats</h2>
        <div class="controls">
          <button id="play">Start</button>
          <button id="pause">Stop</button>
        </div>
      </header>
      <main>
        <pads-grid></pads-grid>
      </main>
      <footer>
        <github-link/>
      </footer>
      `;

    const style = document.createElement('style');
    style.textContent = `
     :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100vw;
      }
      header {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
      }
      header .controls {
        display: flex;
        gap: 8px;
      }
      main {
        flex: 1;
      }
      footer {
        flex-shrink: 0;
      }
    `;
    shadow.appendChild(style);

    // Wire play/pause buttons to PadButton helpers
    const playBtn = shadow.getElementById('play');
    const pauseBtn = shadow.getElementById('pause');
    playBtn?.addEventListener('click', () => this.startLoop());
    pauseBtn?.addEventListener('click', () => this.stopLoop());

    // Listen for pad clicks to record steps
    shadow.addEventListener('pad-clicked', (e: unknown) => {
      if (this._currentStep >= 0) {
        this.recordPadAtStep((e as CustomEvent).detail.pad, this._currentStep);
      }
    });
  }

  private recordPadAtStep(pad: PadButton, step: number) {
    if (!this._recordings.has(step)) {
      this._recordings.set(step, new Set());
    }
    const padsAtStep = this._recordings.get(step)!;
    if (padsAtStep.has(pad)) {
      // Already recorded at this step, remove it (toggle off)
      padsAtStep.delete(pad);
    } else {
      // Record this pad at this step
      padsAtStep.add(pad);
    }
    // Update pad active state for visual feedback if any step has pad recorded
    pad.setActive(padsAtStep.has(pad));
  }

  private startLoop() {
    if (this._loopId) return; // already running

    const bpm = 50;
    const msPerStep = Math.round(60000 / bpm / 4);
    const pads = PadButton.instances;
    let idx = 0;

    this._loopId = window.setInterval(() => {
      // clear previous highlight
      pads.forEach((p) => {
        p.removeAttribute('current');
        p.setActive(false);
      });

      // Set current step and highlight the pad
      this._currentStep = idx;
      const pad = pads[idx % pads.length];
      if (pad) {
        pad.setAttribute('current', '');
      }

      // Play any recordings at this step
      const recordedPads = this._recordings.get(idx) || new Set();
      recordedPads.forEach((p) => {
        p.setActive(true);
        p.removeAttribute('current');
        p.playAudio();
      });

      idx = (idx + 1) % pads.length;
    }, msPerStep);
  }

  private stopLoop() {
    if (this._loopId) {
      clearInterval(this._loopId);
      this._loopId = undefined;
      this._currentStep = -1;
      PadButton.instances.forEach((p) => p.removeAttribute('current'));
    }
  }
}

customElements.define('my-app', App);
