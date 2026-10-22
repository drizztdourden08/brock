/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import { IDENTITY_STICK } from '../src/calibration/calibration.constants';
import { noopInputApi } from '../src/noop-input-api';

describe('the no-op input API', () => {
  it('reports controllers off and lists nothing', async () => {
    expect(await noopInputApi.status()).toEqual({ available: false, sdlVersion: null });
    expect(await noopInputApi.list()).toEqual([]);
    expect(await noopInputApi.refresh()).toEqual([]);
    expect(await noopInputApi.listHid()).toEqual([]);
    expect(await noopInputApi.capture.listJoysticks()).toEqual([]);
  });

  it('gives a fresh list on each call', async () => {
    const first = await noopInputApi.list();
    first.push({ deviceKey: 'x', vendorId: 1, productId: 2, product: 'p', busType: 'usb', status: 'ready' });
    expect(await noopInputApi.list()).toEqual([]);
  });

  it('refuses every action without throwing', async () => {
    expect(await noopInputApi.rumble('k', 1, 1, 100)).toBe(false);
    expect((await noopInputApi.vibratePattern('k', [{ durationMs: 10, intensity: 1 }], 0)).ok).toBe(false);
    expect(await noopInputApi.mapping.add('line')).toBe(false);
    expect(await noopInputApi.mapping.forGuid('guid')).toBeNull();
    expect((await noopInputApi.capture.startRaw(1, 2)).ok).toBe(false);
    expect(await noopInputApi.capture.startJoystick(0)).toBe(false);
    await expect(noopInputApi.rescan()).resolves.toBeUndefined();
    await expect(noopInputApi.calibration.writeStick('k', { left: IDENTITY_STICK, right: IDENTITY_STICK, updatedAt: '' })).resolves.toBeUndefined();
    expect(await noopInputApi.calibration.readSticks()).toEqual({});
  });

  it('subscribes without calling back and hands an unsubscribe', () => {
    const listener = vi.fn();
    const subscriptions = [
      noopInputApi.onAdded(listener), noopInputApi.onRemoved(listener), noopInputApi.onState(listener), noopInputApi.onDevices(listener),
      noopInputApi.capture.onRaw(listener), noopInputApi.capture.onJoystick(listener), noopInputApi.capture.onHoldChanged(listener),
    ];
    for (const unsubscribe of subscriptions) expect(() => unsubscribe()).not.toThrow();
    expect(listener).not.toHaveBeenCalled();
  });

  it('is frozen, so app code cannot patch it for every caller', () => {
    expect(Object.isFrozen(noopInputApi)).toBe(true);
    expect(Object.isFrozen(noopInputApi.capture)).toBe(true);
  });
});
