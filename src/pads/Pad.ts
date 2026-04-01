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
    :host([current]) button {
      border-color: var(--green, #16a34a);
      box-shadow: 0 0 10px var(--green, #16a34a);
      background-color: rgba(22,163,74,0.08);
    }
    :host([playing]) button {
      border-color: var(--yellow, #eab308);
      box-shadow: 0 0 10px var(--yellow, #eab308);
      background-color: rgba(234,179,8,0.08);
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

import audioManager from '../audio/AudioManager';

export class PadButton extends HTMLElement {
  button: HTMLButtonElement;
  soundName: string = '';

  name: string = '';
  static instances: PadButton[] = [];
  private skipNextClick = false;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.button = shadow.querySelector('button') as HTMLButtonElement;

    const activateFromPointerEvent = (e: Event) => {
      e.preventDefault();
      this.skipNextClick = true;
      this.activatePad();
    };

    this.button.addEventListener('pointerdown', activateFromPointerEvent);
    this.button.addEventListener('touchstart', activateFromPointerEvent, { passive: false });

    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.skipNextClick) {
        this.skipNextClick = false;
        return;
      }
      this.activatePad();
    });

    PadButton.instances.push(this);
  }

  static get observedAttributes() {
    return ['data-pad', 'data-path'];
  }

  attributeChangedCallback(name: string, _old: string | null, newV: string | null) {
    if (name === 'data-pad' && this.button) {
      if (newV === null) {
        this.button.textContent = '';
        this.button.removeAttribute('aria-label');
      } else {
        this.name = newV;
        this.button.textContent = newV;
        this.button.setAttribute('aria-label', newV);
      }
    } else if (name === 'data-path') {
      if (newV === null) {
        this.soundName = '';
      } else {
        this.soundName = newV;
        audioManager.loadBuffer(newV, `./samples/${newV}`).catch((err) => {
          console.warn(`Failed to load audio for pad ${this.name}:`, err);
        });
      }
    }
  }

  setActive(active: boolean) {
    if (active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  setPlaying(playing: boolean) {
    if (playing) {
      this.setAttribute('playing', '');
    } else {
      this.removeAttribute('playing');
    }
  }

  private activatePad() {
    this.playAudio();
    this.dispatchEvent(
      new CustomEvent('pad-clicked', { detail: { pad: this }, bubbles: true, composed: true })
    );
  }

  playAudio() {
    if (this.soundName) {
      audioManager.playSound(this.soundName);
    }
  }
}

customElements.define('pad-button', PadButton);
