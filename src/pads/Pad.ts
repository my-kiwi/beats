const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { 
      display: block;
    }
    button {
      touch-action: manipulation; /** Prevent double-tap to zoom on mobile */
      width: 100%;
      height: 100%;
      aspect-ratio: 1;

      border-radius: 8px;
      border-width: 3px;
      border-style: solid;
      border-color: var(--gray-dark, #444);

      color: var(--white, #fff);
      font-size: 1rem;
      font-weight: bold;
      text-align: center;
      background-color: var(--black, #000);
      cursor: pointer;
      padding: 0;
      box-shadow: 0 0 5px var(--gray-dark, #444);
      -webkit-tap-highlight-color: transparent; /** Remove tap highlight on mobile */
    }
    :host([active]) button { 
      border-color: var(--red, red); 
      box-shadow: 0 0 10px var(--red, red);
    }
    button:focus {
      outline: none; /** Remove default focus outline */
    }
    button:focus-visible {
      outline: 2px solid #2684ff; /** keep focus outline for keyboard navigation (accessibility) */
      outline-offset: 2px;
    }
  </style>
  <button part="button"></button>
`;

export class PadButton extends HTMLElement {
  button: HTMLButtonElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.button = shadow.querySelector('button') as HTMLButtonElement;

    // const pad = this.getAttribute('data-pad');
    // if (pad) {
    //   console.log('Pad button created for pad:', pad);
    //   this.button.textContent = pad;
    //   this.button.setAttribute('aria-label', pad);
    // }

    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleActive();
    });
  }

  static get observedAttributes() {
    return ['data-pad'];
  }

  attributeChangedCallback(name: string, _old: string | null, newV: string | null) {
    if (name === 'data-pad' && this.button) {
      if (newV === null) {
        this.button.removeAttribute('data-pad');
        this.button.textContent = '';
        this.button.removeAttribute('aria-label');
      } else {
        this.button.setAttribute('data-pad', newV);
        this.button.textContent = newV;
        this.button.setAttribute('aria-label', newV);
      }
    }
  }

  toggleActive() {
    if (this.hasAttribute('active')) this.removeAttribute('active');
    else this.setAttribute('active', '');
  }
}

customElements.define('pad-button', PadButton);
