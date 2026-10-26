/* @layer core @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { DeviceEntry } from '../src/device.type';
import { controllerInputStore } from '../src/controller-input/controller-input-store';
import { resolveDeviceFromEntry } from '../src/runtime/resolve-device';
import { SDL_BUTTON } from '../src/sdl/sdl-buttons.constants';
import { usePositionalOneByOne } from '../src/views/InputTester/sub-components/diagnostics-wizard/positional-capture/usePositionalOneByOne';
import type { SdlButtonName } from '../src/pad/sdl-button-name.type';

const DEVICE_KEY = '045e:02ff';
const BUTTON_COUNT = 21;
const AXIS_COUNT = 6;

const entry: DeviceEntry = {
  deviceKey: DEVICE_KEY, vendorId: 0x045e, productId: 0x02ff, product: 'Pad', name: 'Xbox Controller', busType: 'usb', status: 'ready',
  sdlType: 'xboxone',
  hasButton: Array.from({ length: BUTTON_COUNT }, () => true),
  hasAxis: Array.from({ length: AXIS_COUNT }, () => true),
};

const resolved = resolveDeviceFromEntry(entry);

type Capture = ReturnType<typeof usePositionalOneByOne>;

const mounted: { current: Capture | null; autoCapture: boolean; root: Root | null } = { current: null, autoCapture: true, root: null };

const Harness = () => {
  mounted.current = usePositionalOneByOne({
    deviceKey: DEVICE_KEY,
    active: true,
    resolvedDevice: resolved,
    autoCapture: mounted.autoCapture,
    onAutoCaptureChange: (on) => { mounted.autoCapture = on; },
  });
  return null;
};

const press = (index: number): void => {
  const buttons = Array.from({ length: BUTTON_COUNT }, (_unused, i) => i === index);
  act(() => controllerInputStore.handleControllerState(DEVICE_KEY, buttons, Array.from({ length: AXIS_COUNT }, () => 0)));
};

const release = (): void => {
  act(() => controllerInputStore.handleControllerState(DEVICE_KEY, Array.from({ length: BUTTON_COUNT }, () => false), Array.from({ length: AXIS_COUNT }, () => 0)));
};

const current = (): Capture => {
  if (!mounted.current) throw new Error('The harness has not rendered.');
  return mounted.current;
};

describe('the positional capture step', () => {
  beforeEach(() => {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true);
    mounted.current = null;
    mounted.autoCapture = true;
    const container = document.createElement('div');
    mounted.root = createRoot(container);
    act(() => { mounted.root?.render(createElement(Harness)); });
  });

  afterEach(() => {
    act(() => { mounted.root?.unmount(); });
  });

  it('starts listening on its own, with auto-capture on by default', () => {
    expect(mounted.autoCapture).toBe(true);
    expect(current().items.length).toBeGreaterThan(0);
    expect(current().inputPhaseActive).toBe(true);
    expect(current().autoAdvance).toBe(true);
    expect(current().activeIndex).toBe(0);
  });

  it('records a button pressed on a pad that was idle when the step began', () => {
    const index = current().items.findIndex((item) => item.kind === 'button');
    const target = current().items[index];
    expect(target).toBeDefined();
    act(() => current().onClickItem(index));
    press(SDL_BUTTON[(target?.id ?? '') as SdlButtonName]);
    const record = current().records[index];
    expect(record?.status).toBe('captured');
    expect(record?.firedIndex).toBe(SDL_BUTTON[(target?.id ?? '') as SdlButtonName]);
    expect(record?.mismatch).toBe(false);
    release();
    expect(current().items[index]?.status).toBe('captured');
  });

  it('can be turned off, and then ignores presses until it is turned on again', () => {
    act(() => current().onAutoCaptureToggle(false));
    expect(mounted.autoCapture).toBe(false);
    expect(current().inputPhaseActive).toBe(false);
    press(0);
    release();
    expect(current().records.filter(Boolean)).toHaveLength(0);
    act(() => current().onAutoCaptureToggle(true));
    expect(current().inputPhaseActive).toBe(true);
  });
});
