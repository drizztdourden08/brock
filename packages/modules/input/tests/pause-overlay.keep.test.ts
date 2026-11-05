/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { decidePauseOverlay } from '../src/renderer/overlays/ControllerPauseLayer/behavior/decide-pause-overlay';

describe('decidePauseOverlay', { tags: ['critical'] }, () => {
  it('shows nothing unless the game runs and a pause is active', () => {
    expect(decidePauseOverlay('running', false, '')).toBe('none');
    expect(decidePauseOverlay('stopped', true, 'Pad')).toBe('none');
  });

  it('treats an empty or manual name as a manual pause', () => {
    expect(decidePauseOverlay('running', true, '')).toBe('manual');
    expect(decidePauseOverlay('running', true, 'Manual pause')).toBe('manual');
    expect(decidePauseOverlay('running', true, 'Custom', 'Custom')).toBe('manual');
  });

  it('shows the disconnect card for a named controller', () => {
    expect(decidePauseOverlay('running', true, 'Xbox Pad')).toBe('disconnect');
  });
});
