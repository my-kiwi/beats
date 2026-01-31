import { describe, it, expect, beforeEach } from 'vitest';
import './PadsGrid';

describe('PadsGrid (web component)', () => {
  let grid: HTMLElement;

  beforeEach(() => {
    grid = document.createElement('pads-grid');
    document.body.appendChild(grid);
  });

  it('renders the pads-grid component', () => {
    expect(grid).toBeDefined();
  });

  it('has shadow DOM with pad-button elements', () => {
    const shadow = grid.shadowRoot;
    expect(shadow).toBeDefined();
    const pads = shadow?.querySelectorAll('pad-button') || [];
    expect(pads.length).toBe(16);
  });

  it('contains pad-row wrappers', () => {
    const shadow = grid.shadowRoot;
    expect(shadow?.querySelector('.pad-row')).toBeDefined();
  });
});
