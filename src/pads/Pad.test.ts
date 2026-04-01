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

  it('setActive should add and remove active attribute', () => {
    pad.setActive(true);
    expect(pad.hasAttribute('active')).toBe(true);
    pad.setActive(false);
    expect(pad.hasAttribute('active')).toBe(false);
  });

  it('pointerdown on the internal button dispatches pad-clicked event immediately', () => {
    const btn = pad.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDefined();
    let eventCount = 0;
    pad.addEventListener('pad-clicked', () => {
      eventCount += 1;
    });

    // JSDOM may not support PointerEvent, we can dispatch a MouseEvent with type pointerdown.
    btn.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(eventCount).toBe(1);

    // Should not fire a second time from the follow-up click
    btn.click();
    expect(eventCount).toBe(1);
  });

  it('touchstart on the internal button dispatches pad-clicked event immediately', () => {
    const btn = pad.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDefined();
    let eventCount = 0;
    pad.addEventListener('pad-clicked', () => {
      eventCount += 1;
    });

    btn.dispatchEvent(
      new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [] })
    );
    expect(eventCount).toBe(1);

    btn.click();
    expect(eventCount).toBe(1);
  });

  it('clicking the button when not preceded by pointerdown dispatches pad-clicked event', () => {
    const btn = pad.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeDefined();
    let eventFired = false;
    pad.addEventListener('pad-clicked', () => {
      eventFired = true;
    });
    btn.click();
    expect(eventFired).toBe(true);
  });
});
