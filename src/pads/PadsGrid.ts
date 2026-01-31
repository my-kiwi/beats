import './Pad';

export class PadsGrid extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const totalPads = 16;
    const rows = 2;
    const breakpoint = Math.floor(totalPads / rows);

    const padsHTML = Array.from({ length: rows }, (_, row) => {
      const start = row * breakpoint + 1;
      const pads = Array.from(
        { length: breakpoint },
        (_, i) => `<pad-button data-pad="${start + i}"></pad-button>`
      ).join('');
      return `<div class="pad-row">${pads}</div>`;
    }).join('');

    shadow.innerHTML = `
      <div class="pads-grid">
        ${padsHTML}
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .pads-grid {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        width: calc(100% - 40px);
      }
      .pad-row {
        display: flex;
        width: 100%;
        gap: 12px;
        margin-bottom: 12px;
      }
      pad-button {
        flex: 1 1 calc(12.5% - 24px);
        display: block;
      }
    `;

    shadow.appendChild(style);
  }
}

customElements.define('pads-grid', PadsGrid);
