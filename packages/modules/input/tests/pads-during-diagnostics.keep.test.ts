/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { DeviceEntry } from '../src/device.type';
import { groupControllerDevices } from '../src/runtime/controller-device-groups';
import { holdAwareGroups } from '../src/runtime/hold-aware-groups';
import { padNavEntries } from '../src/views/ControllerPage/behavior/pad-nav-entries';

const pad = (deviceKey: string, name: string): DeviceEntry => ({
  deviceKey, name, product: name, vendorId: 0x045e, productId: 0x02ff, busType: 'usb', status: 'ready',
});

const before = groupControllerDevices([pad('045e:02ff', 'Xbox Controller')]);
const NONE = groupControllerDevices([]);

const labelsOf = (released: boolean, live = NONE) =>
  padNavEntries(holdAwareGroups(live, before, released), released).map((entry) => entry.label);

describe('the pads in the Controllers nav during diagnostics', () => {
  it('keeps the last known pads, marked, while the hold is released', () => {
    const labels = labelsOf(true);
    expect(labels).toHaveLength(1);
    expect(labels[0]).toMatch(/\(in diagnostics\)$/);
    expect(padNavEntries(holdAwareGroups(NONE, before, true), true).map((entry) => entry.id)).toEqual(['045e:02ff']);
  });

  it('shows the live list again, unmarked, once the hold returns', () => {
    const live = groupControllerDevices([pad('045e:02ff', 'Xbox Controller')]);
    expect(labelsOf(false, live)[0]).not.toMatch(/diagnostics/);
  });

  it('lists nothing when no pad was known before the release', () => {
    expect(padNavEntries(holdAwareGroups(NONE, NONE, true), true)).toEqual([]);
  });

  it('does not bring back a pad that was unplugged while the hold was held', () => {
    expect(padNavEntries(holdAwareGroups(NONE, before, false))).toEqual([]);
  });
});
