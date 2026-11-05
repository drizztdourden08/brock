/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import { backStepOf } from '../src/renderer/components/MobileShell/behavior/back-step-of';
import { isMobileHost } from '../src/renderer/platform/is-mobile-host';

const platform = vi.hoisted(() => ({ formFactor: 'mobile' }));

vi.mock('@drizztdourden08/brock-react', () => ({
  getPlatform: () => ({ info: { formFactor: platform.formFactor } }),
}));

describe('K3 mobile shell logic', { tags: ['critical'] }, () => {
  it('detects a mobile host from the form factor', () => {
    platform.formFactor = 'mobile';
    expect(isMobileHost()).toBe(true);
    platform.formFactor = 'desktop';
    expect(isMobileHost()).toBe(false);
  });

  it('closes an open drawer first, whatever the edge', () => {
    expect(backStepOf(true, 'left', true)).toBe('close');
    expect(backStepOf(true, 'right', false)).toBe('close');
  });

  it('opens the drawer from the right edge', () => {
    expect(backStepOf(false, 'right', true)).toBe('open');
  });

  it('leaves a screen, or goes home, from the left edge', () => {
    expect(backStepOf(false, 'left', true)).toBe('escape');
    expect(backStepOf(false, 'left', false)).toBe('home');
  });
});
