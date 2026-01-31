import './Pad';

const NUMBER_OF_PADS = 16;

export class PadsGrid extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // create 2 rows of 8 pads
    const numberOfRows = 2;
    const breakpoint = NUMBER_OF_PADS / numberOfRows;

    for (let i = 0; i < NUMBER_OF_PADS; i += breakpoint) {
      const row = document.createElement('div');
      row.className = 'pad-row';

      for (let j = 0; j < breakpoint; j++) {
        const pad = document.createElement('pad-button');
        pad.dataset.pad = String(i + j + 1);
        row.appendChild(pad);
      }

      shadow.appendChild(row);
    }

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        box-sizing: border-box;
        padding: var(--unit);
      }
      .pad-row {
        display: flex;
        width: 100%;
        gap: 12px;
        margin-bottom: 12px;
      }
      pad-button {
        flex: 1;
        display: block;
      }
    `;

    shadow.appendChild(style);
  }
}

customElements.define('pads-grid', PadsGrid);
