/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { buildDeviceSnapshot } from '../src/devices/build-device-snapshot';
import type { LiveDevice } from '../src/devices/live-device.type';
import type { ControllerGamepadType } from '../src/device.type';
import { SDL_AXIS_NAMES, SDL_BUTTON_NAMES } from '../src/input.constants';
import { padFamilyOf } from '../src/pad/pad-family-of';
import { padStateOf } from '../src/pad/pad-state-of';
import { CONTROLLER_SLOT_IDS } from '../src/pad/pad-slots.constants';

const buttonsWith = (...down: (typeof SDL_BUTTON_NAMES)[number][]): boolean[] =>
  SDL_BUTTON_NAMES.map((name) => down.includes(name));

const NO_AXES = SDL_AXIS_NAMES.map(() => 0);

describe('the SDL to slot mapping', () => {
  it('reports every slot', () => {
    const state = padStateOf(buttonsWith(), NO_AXES);
    expect(Object.keys(state).sort()).toEqual([...CONTROLLER_SLOT_IDS].sort());
  });

  it('puts each SDL button in its physical slot', () => {
    const pairs = [
      ['SOUTH', 'face.south'], ['EAST', 'face.east'], ['WEST', 'face.west'], ['NORTH', 'face.north'],
      ['DPAD_UP', 'dpad.up'], ['DPAD_DOWN', 'dpad.down'], ['DPAD_LEFT', 'dpad.left'], ['DPAD_RIGHT', 'dpad.right'],
      ['LEFT_SHOULDER', 'shoulder.left'], ['RIGHT_SHOULDER', 'shoulder.right'],
      ['LEFT_STICK', 'stick.left.click'], ['RIGHT_STICK', 'stick.right.click'],
      ['BACK', 'meta.view'], ['START', 'meta.menu'], ['GUIDE', 'meta.guide'], ['MISC1', 'meta.capture'],
      ['RIGHT_PADDLE1', 'extra.paddle1'], ['LEFT_PADDLE1', 'extra.paddle2'],
      ['RIGHT_PADDLE2', 'extra.paddle3'], ['LEFT_PADDLE2', 'extra.paddle4'],
      ['TOUCHPAD', 'extra.touchpad'], ['MISC3', 'extra.misc'],
    ] as const;
    for (const [button, slot] of pairs) {
      const state = padStateOf(buttonsWith(button), NO_AXES);
      const lit = CONTROLLER_SLOT_IDS.filter((id) => state[id]?.pressed === true);
      expect(lit, button).toEqual([slot]);
    }
  });

  it('reads triggers as 0..1 values', () => {
    const state = padStateOf(buttonsWith(), [0, 0, 0, 0, 0.25, 1]);
    expect(state['trigger.left']).toEqual({ value: 0.25 });
    expect(state['trigger.right']).toEqual({ value: 1 });
  });

  it('reads sticks with up as positive Y', () => {
    const state = padStateOf(buttonsWith(), [0.5, -1, -0.25, 0.75, 0, 0]);
    expect(state['stick.left']).toEqual({ x: 0.5, y: 1 });
    expect(state['stick.right']).toEqual({ x: -0.25, y: -0.75 });
  });

  it('never reports negative zero', () => {
    const state = padStateOf(buttonsWith(), NO_AXES);
    expect(Object.is(state['stick.left']?.y, 0)).toBe(true);
  });

  it('reads an empty state as idle', () => {
    const state = padStateOf([], []);
    expect(state['face.south']).toEqual({ pressed: false });
    expect(state['stick.right']).toEqual({ x: 0, y: 0 });
    expect(state['trigger.left']).toEqual({ value: 0 });
  });
});

describe('the SDL gamepad type to family mapping', () => {
  it('maps every SDL type', () => {
    const expected: Record<ControllerGamepadType, string> = {
      unknown: 'generic', standard: 'generic', xbox360: 'xbox', xboxone: 'xbox', ps3: 'playstation', ps4: 'playstation',
      ps5: 'playstation', 'switch-pro': 'nintendo', 'joycon-left': 'nintendo', 'joycon-right': 'nintendo',
      'joycon-pair': 'nintendo', gamecube: 'nintendo',
    };
    for (const [type, family] of Object.entries(expected)) expect(padFamilyOf(type as ControllerGamepadType), type).toBe(family);
  });

  it('puts the family on a ready entry and not on an unavailable one', () => {
    const device: LiveDevice = {
      deviceKey: '054c:0ce6', name: 'DualSense', sdlId: 1, vendorId: 0x054c, productId: 0x0ce6, guid: 'g', mapping: null,
      hasRumble: true, hasGyro: true, connectionState: 'wired', sdlType: 'ps5', hasButton: [], hasAxis: [], buttonLabels: [],
    };
    const listed = [{ vendorId: 0x1234, productId: 0x5678, product: 'Other', busType: 'usb' as const }];
    const [ready, unavailable] = buildDeviceSnapshot(new Map([[device.deviceKey, device]]), listed);
    expect(ready?.family).toBe('playstation');
    expect(unavailable?.family).toBeUndefined();
  });
});
