/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { capabilityOf } from '../src/platform/capability-of';

const BASE = { windowChrome: false, selfUpdate: false, nativeFileDialog: false, revealDataFolder: false, hapticFeedback: false };

describe('K1 capabilityOf', { tags: ['critical'] }, () => {
  it('reads titleBar as true when a custom platform factory leaves it out', () => {
    expect(capabilityOf(BASE, 'titleBar')).toBe(true);
    expect(capabilityOf({ ...BASE, titleBar: false }, 'titleBar')).toBe(false);
  });
});
