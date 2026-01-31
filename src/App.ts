import './GithubLink';
import './pads/PadsGrid';
import { PadButton } from './pads/Pad';

class App extends HTMLElement {
  private _loopId: number | undefined;
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
  }

  startLoop() {
    if (this._loopId) return; // already running

    const bpm = 100;
    // const stepsPerBar = 16; // 4/4 with 16th notes
    const msPerStep = Math.round(60000 / bpm / 4);
    const pads = PadButton.instances;
    let idx = 0;

    this._loopId = window.setInterval(() => {
      // clear previous
      pads.forEach((p) => p.removeAttribute('current'));

      const pad = pads[idx % pads.length];
      if (pad) {
        pad.setAttribute('current', '');
        if (pad.hasAttribute('active')) pad.playAudio();
      }

      idx = (idx + 1) % pads.length;
    }, msPerStep);
  }

  stopLoop() {
    if (this._loopId) {
      clearInterval(this._loopId);
      this._loopId = undefined;
      PadButton.instances.forEach((p) => p.removeAttribute('current'));
    }
  }
}

customElements.define('my-app', App);
