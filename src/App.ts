import './Counter';
import './GithubLink';
import './Pad';

class App extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Generate 16 pads (todo each pad should be a separate component)

    const breakpoint = 8;
    const padsHTML =
      '<div class="pad-row">' +
      Array.from(
        { length: 16 },
        (_, i) =>
          `<pad-button data-pad="${i + 1}"></pad-button>` +
          ((i + 1) % breakpoint === 0 ? '</div><div class="pad-row">' : '')
      ).join('') +
      '</div>';

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
