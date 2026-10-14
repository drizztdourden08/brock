/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { capabilityOf } from '../src/platform/capability-of';

const BASE = { windowChrome: false, selfUpdate: false, nativeFileDialog: false, revealDataFolder: false, hapticFeedback: false };

describe('capabilityOf', () => {
  it('reads titleBar as true when a custom platform factory leaves it out', () => {
    expect(capabilityOf(BASE, 'titleBar')).toBe(true);
    expect(capabilityOf({ ...BASE, titleBar: false }, 'titleBar')).toBe(false);
  });

  it('reads the required capabilities as they are given', () => {
    expect(capabilityOf({ ...BASE, windowChrome: true }, 'windowChrome')).toBe(true);
    expect(capabilityOf(BASE, 'selfUpdate')).toBe(false);
  });
});
