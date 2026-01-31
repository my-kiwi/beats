import './GithubLink';
import './pads/PadsGrid';
import Sequencer from './sequencer/Sequencer';
import LoopRecorder from './sequencer/LoopRecorder';

class App extends HTMLElement {
  private sequencer: Sequencer;
  private loopRecorder: LoopRecorder;

  constructor() {
    super();

    this.sequencer = new Sequencer(16, 50);
    this.loopRecorder = new LoopRecorder();
    this.sequencer.subscribe(this.loopRecorder);

    this.renderUI();
    this.setupEventHandlers();
  }

  private renderUI() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <header>
        <h2>Beats</h2>
        <div class="bpm-control">
          <label for="bpm-slider">BPM:</label>
          <input id="bpm-slider" type="range" min="20" max="200" value="50" />
          <span id="bpm-value">50</span>
        </div>
        <div class="controls">
          <button id="play">Start</button>
          <button id="pause">Stop</button>
          <button id="clear">Clear</button>
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
      header .bpm-control {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        justify-content: center;
      }
      header .bpm-control label {
        font-weight: bold;
        white-space: nowrap;
      }
      header .bpm-control input[type="range"] {
        width: 150px;
      }
      header .bpm-control span {
        min-width: 35px;
        text-align: right;
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
  }

  private setupEventHandlers() {
    const shadow = this.shadowRoot!;
    const playBtn = shadow.getElementById('play');
    const pauseBtn = shadow.getElementById('pause');
    const clearBtn = shadow.getElementById('clear');
    const bpmSlider = shadow.getElementById('bpm-slider') as HTMLInputElement;
    const bpmValue = shadow.getElementById('bpm-value');

    playBtn?.addEventListener('click', () => this.sequencer.start());
    pauseBtn?.addEventListener('click', () => this.sequencer.stop());
    clearBtn?.addEventListener('click', () => this.loopRecorder.clear());

    bpmSlider?.addEventListener('input', (e) => {
      const bpm = parseInt((e.target as HTMLInputElement).value);
      this.sequencer.setBpm(bpm);
      if (bpmValue) bpmValue.textContent = String(bpm);
    });

    // Listen for pad clicks to record steps during playback
    shadow.addEventListener('pad-clicked', (e: unknown) => {
      const currentStep = this.sequencer.currentStep;
      if (currentStep >= 0) {
        this.loopRecorder.recordPadAtStep((e as CustomEvent).detail.pad, currentStep);
      }
    });
  }
}

customElements.define('my-app', App);
