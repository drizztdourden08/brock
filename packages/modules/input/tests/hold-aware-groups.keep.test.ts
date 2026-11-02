/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ControllerDeviceGroup } from '../src/runtime/controller-device-groups.type';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const holdListeners = new Set<(held: boolean) => void>();

vi.mock('../src/renderer/is-input-available', () => ({ isInputAvailable: () => true }));
vi.mock('../src/renderer/input-api', () => ({
  inputApi: () => ({
    capture: {
      onHoldChanged: (listener: (held: boolean) => void) => {
        holdListeners.add(listener);
        return () => { holdListeners.delete(listener); };
      },
    },
  }),
}));

const { useHoldAwareGroups } = await import('../src/renderer/useHoldAwareGroups');

const groupNamed = (product: string): ControllerDeviceGroup => ({
  vendorId: 1, productId: 2, product, busType: 'usb', isAdapter: false, ports: [],
});

const KNOWN = [groupNamed('Xbox pad')];
const NONE: ControllerDeviceGroup[] = [];

let root: Root | null = null;
let host: HTMLElement | null = null;

const Probe = ({ live }: { live: readonly ControllerDeviceGroup[] }) => {
  const { groups, released } = useHoldAwareGroups(live);
  return createElement('output', null, `${released}|${groups.map((group) => group.product).join(',')}`);
};

const render = (live: readonly ControllerDeviceGroup[]): void => {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(Probe, { live })));
};

const announceHold = (held: boolean): void => {
  act(() => { for (const listener of holdListeners) listener(held); });
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  host?.remove();
  host = null;
});

describe('K1 the device groups while the gamepads are released for a capture', { tags: ['critical'] }, () => {
  it('reads released and keeps the last known groups when the hold event says released', () => {
    const view = (): string => host?.textContent ?? '';
    render(KNOWN);
    expect(view()).toBe('false|Xbox pad');
    act(() => root?.render(createElement(Probe, { live: KNOWN })));
    announceHold(true);
    act(() => root?.render(createElement(Probe, { live: NONE })));
    expect(view()).toBe('true|Xbox pad');
    announceHold(false);
    expect(view()).toBe('false|');
  });
});
