import './GithubLink';
import './pads/PadsGrid';
import Sequencer from './sequencer/Sequencer';
import LoopRecorder from './sequencer/LoopRecorder';

class App extends HTMLElement {
  private _sequencer: Sequencer;
  private _loopRecorder: LoopRecorder;

  constructor() {
    super();

    this._sequencer = new Sequencer(16, 50);
    this._loopRecorder = new LoopRecorder();
    this._sequencer.subscribe(this._loopRecorder);

    this._renderUI();
    this._setupEventHandlers();
  }

  private _renderUI() {
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
  }

  private _setupEventHandlers() {
    const shadow = this.shadowRoot!;
    const playBtn = shadow.getElementById('play');
    const pauseBtn = shadow.getElementById('pause');

    playBtn?.addEventListener('click', () => this._sequencer.start());
    pauseBtn?.addEventListener('click', () => this._sequencer.stop());

    // Listen for pad clicks to record steps during playback
    shadow.addEventListener('pad-clicked', (e: unknown) => {
      const currentStep = this._sequencer.currentStep;
      if (currentStep >= 0) {
        this._loopRecorder.recordPadAtStep((e as CustomEvent).detail.pad, currentStep);
      }
    });
  }
}

customElements.define('my-app', App);
