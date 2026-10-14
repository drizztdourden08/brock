/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { DeviceEntry } from '../src/device.type';
import type { DeviceCardAction } from '../src/renderer/device-card-action.type';
import { registerDeviceCardActions } from '../src/renderer/register-device-card-actions';
import { shownDeviceCardActions } from '../src/renderer/shown-device-card-actions';
import { useDeviceCardActionStore } from '../src/renderer/useDeviceCardActionStore';

const entry = (busType: DeviceEntry['busType'] = 'usb'): DeviceEntry => ({
  deviceKey: '045e:028e', vendorId: 0x045e, productId: 0x028e, product: 'Pad', busType, status: 'ready',
});

const action = (id: string, extra: Partial<DeviceCardAction> = {}): DeviceCardAction => ({ id, label: id, onSelect: vi.fn(), ...extra });

describe('app actions on the device card', () => {
  it('shows registered actions first, then the ones given to the card', () => {
    const shown = shownDeviceCardActions([action('report')], [action('export')], entry());
    expect(shown.map((s) => s.action.id)).toEqual(['report', 'export']);
  });

  it('lets a given action replace a registered one with the same id', () => {
    const given = action('report', { label: 'Report this pad' });
    const shown = shownDeviceCardActions([action('report')], [given], entry());
    expect(shown).toEqual([{ action: given, disabled: false }]);
  });

  it('hides an action whose visible check fails for the device and resolves disabled per device', () => {
    const wirelessOnly = action('pair', { visible: (device) => device.busType === 'bluetooth' });
    const offOnUsb = action('reset', { disabled: (device) => device.busType === 'usb' });
    const always = action('off', { disabled: true });
    expect(shownDeviceCardActions([wirelessOnly, offOnUsb, always], [], entry('usb')).map((s) => [s.action.id, s.disabled]))
      .toEqual([['reset', true], ['off', true]]);
    expect(shownDeviceCardActions([wirelessOnly, offOnUsb], [], entry('bluetooth')).map((s) => [s.action.id, s.disabled]))
      .toEqual([['pair', false], ['reset', false]]);
  });

  it('registers actions on the module and removes exactly them on unregister', () => {
    const keep = [action('keep')];
    const dropKeep = registerDeviceCardActions(keep);
    const drop = registerDeviceCardActions([action('temp')]);
    expect(useDeviceCardActionStore.getState().groups.flat().map((a) => a.id)).toEqual(['keep', 'temp']);
    drop();
    expect(useDeviceCardActionStore.getState().groups.flat().map((a) => a.id)).toEqual(['keep']);
    dropKeep();
    expect(useDeviceCardActionStore.getState().groups).toEqual([]);
  });
});
