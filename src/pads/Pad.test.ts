import { describe, it, expect, beforeEach } from 'vitest';
import './Pad';
import { PadButton } from './Pad';

describe('Pad', () => {
  let pad: PadButton;

  beforeEach(() => {
    pad = document.createElement('pad-button') as PadButton;
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

  it('toggleActive should add and remove active attribute', () => {
    pad.toggleActive();
    expect(pad.hasAttribute('active')).toBe(true);
    pad.toggleActive();
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
