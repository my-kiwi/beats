import './GithubLink';
import './Pad';

class App extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Generate 16 pads in a 2x8 grid
    const totalPads = 16;
    const rows = 2;
    const breakpoint = totalPads / rows;

    const padsHTML = Array.from({ length: rows }, (_, row) => {
      const start = row * breakpoint + 1;

      const pads = Array.from(
        { length: breakpoint },
        (_, i) => `<pad-button data-pad="${start + i}"></pad-button>`
      ).join('');

      return `<div class="pad-row">${pads}</div>`;
    }).join('');

    shadow.innerHTML = `
      <header>
        <h2>Beats</h2>
      </header>
      <main>
        <div class="pads-grid">
          ${padsHTML}
        </div>
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
      }
      
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
      main {
        flex: 1;
      }
      footer {
        flex-shrink: 0;
      }
    `;
    shadow.appendChild(style);
  }
}

customElements.define('my-app', App);
