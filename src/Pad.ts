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
      background-color: var(--black, #000);
      cursor: pointer;
      transition: all 0.1s ease;
      padding: 0;
      box-shadow: 0 0 5px var(--gray-dark, #444);
    }
    button:active { 
      transform: scale(0.95); 
    }
    :host([active]) button { 
      border-color: var(--red, red); 
      box-shadow: 0 0 10px var(--red, red);
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

    const pad = this.getAttribute('data-pad');
    if (pad) this.button.setAttribute('data-pad', pad);

    this.button.addEventListener('click', () => {
      this.toggleActive();
    });
  }

  static get observedAttributes() {
    return ['data-pad'];
  }

  attributeChangedCallback(name: string, _old: string | null, newV: string | null) {
    if (name === 'data-pad' && this.button) {
      if (newV === null) this.button.removeAttribute('data-pad');
      else this.button.setAttribute('data-pad', newV);
    }
  }

  toggleActive() {
    if (this.hasAttribute('active')) this.removeAttribute('active');
    else this.setAttribute('active', '');
  }
}

customElements.define('pad-button', PadButton);
