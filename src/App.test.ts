import { describe, it, expect, beforeEach } from 'vitest';
import './App';

describe('App', () => {
  let app: HTMLElement;

  beforeEach(() => {
    app = document.createElement('my-app');
    document.body.appendChild(app);
  });

  it('should render the app component', () => {
    expect(app).toBeDefined();
  });

  it('should contain header with title', () => {
    const shadowRoot = app.shadowRoot;
    expect(shadowRoot).toBeDefined();
    expect(shadowRoot?.innerHTML).toContain('Beats');
  });

  it('should contain pads and github link elements', () => {
    const shadowRoot = app.shadowRoot;
    expect(shadowRoot?.innerHTML).toContain('<pads-grid>');
    expect(shadowRoot?.innerHTML).toContain('<github-link>');
  });
});
