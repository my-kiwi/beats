import { describe, it, expect, beforeEach } from 'vitest';
import './Pad';
import { PadButton } from './Pad';

describe('Pad', () => {
  let pad: HTMLElement;

  beforeEach(() => {
    pad = document.createElement('pad-button');
    document.body.appendChild(pad);
  });

  it('should render the pad component', () => {
    expect(pad).toBeDefined();
  });

  it('should have shadow DOM with button element', () => {
    const shadowRoot = pad.shadowRoot;
    expect(shadowRoot).toBeDefined();
    expect(shadowRoot?.querySelector('button')).toBeDefined();
  });

  it('should set data-pad on internal button when host has data-pad attribute', () => {
    const p = document.createElement('pad-button');
    p.setAttribute('data-pad', 'kick');
    document.body.appendChild(p);
    const btn = p.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn?.getAttribute('data-pad')).toBe('kick');
  });

  it('should update internal button when data-pad attribute changes', () => {
    const btn = pad.shadowRoot?.querySelector('button') as HTMLButtonElement;
    pad.setAttribute('data-pad', 'snare');
    expect(btn?.getAttribute('data-pad')).toBe('snare');
  });

  it('toggleActive should add and remove active attribute', () => {
    const cast = pad as PadButton;
    cast.toggleActive();
    expect(pad.hasAttribute('active')).toBe(true);
    cast.toggleActive();
    expect(pad.hasAttribute('active')).toBe(false);
  });

  it('clicking the internal button toggles active state', () => {
    const btn = pad.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDefined();
    btn.click();
    expect(pad.hasAttribute('active')).toBe(true);
    btn.click();
    expect(pad.hasAttribute('active')).toBe(false);
  });
});
