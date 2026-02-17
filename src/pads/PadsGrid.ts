import './Pad';

const NUMBER_OF_PADS = 16;

type PadConfig = {
  name: string;
  path: string;
};

// todo move to a JSON or similar
export const padsConfig: PadConfig[] = [
  { name: 'Kick', path: 'General Kick 1.mp3' },
  { name: 'Snare', path: 'General Snare 1.mp3' },
  { name: 'Snare 2', path: 'General Room Snare 2.mp3' },
  { name: 'Hi-Hat Closed', path: 'General Closed Hihat.mp3' },
  { name: 'Hi-Hat Open', path: 'General Open Hihat.mp3' },
  { name: 'Clap', path: 'General Room Clap 1.mp3' },
  { name: 'Tom Low', path: 'General Low Tom.mp3' },
  { name: 'Tom Mid', path: 'General Room Mid Tom.mp3' },
  { name: 'Tom High', path: 'General Room Hi Tom.mp3' },
  { name: 'Rimshot', path: 'General Room Stick 1.mp3' },
  { name: 'Cowbell', path: 'General Cowbell.mp3' },
  { name: 'Crash Cymbal', path: 'General Crash.mp3' },
  { name: 'Ride Cymbal', path: 'General Ride.mp3' },
  { name: 'Shaker', path: 'General Room Ride.mp3' },
  { name: 'Tambourine', path: 'General Tambourine.mp3' },
  { name: 'Conga', path: 'General Conga.mp3' },
];

export class PadsGrid extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.className = 'pads';

    for (let i = 0; i < NUMBER_OF_PADS; i++) {
      const pad = document.createElement('pad-button');
      pad.dataset.pad = padsConfig[i].name;
      pad.dataset.path = padsConfig[i].path;
      container.appendChild(pad);
    }

    shadow.appendChild(container);

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        box-sizing: border-box;
        padding: var(--unit);
      }
      .pads {
        display: grid;
        width: 100%;
        gap: 12px;
        grid-template-columns: repeat(8, 1fr);
      }
      pad-button {
        width: 100%;
        display: block;
      }
      @media (orientation: portrait) {
        .pads {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    `;

    shadow.appendChild(style);
  }
}

customElements.define('pads-grid', PadsGrid);
