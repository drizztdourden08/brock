/* @layer core @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DeviceEntry } from '../src/device.type';
import type { InputApi } from '../src/input-api.type';
import { noopInputApi } from '../src/noop-input-api';

const pad: DeviceEntry = {
  deviceKey: '045e:02ff', name: 'Xbox Controller', product: 'Xbox Controller', vendorId: 0x045e, productId: 0x02ff,
  busType: 'usb', status: 'ready',
};

const holdListeners: ((held: boolean) => void)[] = [];
const deviceListeners: ((devices: DeviceEntry[]) => void)[] = [];
const list = vi.fn(() => Promise.resolve([pad]));

const fakeApi: InputApi = {
  ...noopInputApi,
  status: () => Promise.resolve({ available: true, sdlVersion: '3.2.0' }),
  list,
  onDevices: (listener) => {
    deviceListeners.push(listener);
    return () => undefined;
  },
  capture: {
    ...noopInputApi.capture,
    onHoldChanged: (listener) => {
      holdListeners.push(listener);
      return () => undefined;
    },
  },
};

let available = true;

vi.mock('../src/renderer/host-input-api', () => ({ hostInputApi: () => (available ? fakeApi : null) }));

const settle = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('the device list at boot', () => {
  beforeEach(() => {
    vi.resetModules();
    holdListeners.length = 0;
    deviceListeners.length = 0;
    list.mockClear();
    available = true;
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('lists the pads that are already connected without a page opening', async () => {
    const { startControllerDevices } = await import('../src/controller-input/start-controller-devices');
    const { useControllerDevicesStore } = await import('../src/renderer/useControllerDevicesStore');
    startControllerDevices();
    await settle();
    expect(list).toHaveBeenCalledTimes(1);
    expect(useControllerDevicesStore.getState().entries).toEqual([pad]);
    expect(useControllerDevicesStore.getState().loaded).toBe(true);
    expect(deviceListeners).toHaveLength(1);
  });

  it('lists the pads again once the hold is restored, and not while it is released', async () => {
    const { startControllerDevices } = await import('../src/controller-input/start-controller-devices');
    startControllerDevices();
    await settle();
    holdListeners.forEach((listener) => listener(false));
    await settle();
    expect(list).toHaveBeenCalledTimes(1);
    holdListeners.forEach((listener) => listener(true));
    await settle();
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('stays unloaded while the input API is not there yet, so a later page can load it', async () => {
    available = false;
    const { startControllerDevices } = await import('../src/controller-input/start-controller-devices');
    const { useControllerDevicesStore } = await import('../src/renderer/useControllerDevicesStore');
    startControllerDevices();
    await settle();
    expect(useControllerDevicesStore.getState().loaded).toBe(false);
  });
});
