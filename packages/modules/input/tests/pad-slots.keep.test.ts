/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { buildDeviceSnapshot } from '../src/devices/build-device-snapshot';
import type { LiveDevice } from '../src/devices/live-device.type';
import type { ControllerGamepadType, ControllerStateListener, DeviceEntry } from '../src/device.type';
import type { PadFamily } from '../src/pad/controller-slot.type';
import { padStateSubscription } from '../src/pad/pad-state-subscription';
import { SDL_AXIS_NAMES, SDL_BUTTON_NAMES } from '../src/input.constants';
import { padFamilyOf } from '../src/pad/pad-family-of';
import { padStateOf } from '../src/pad/pad-state-of';
import { CONTROLLER_SLOT_IDS } from '../src/pad/controller-slot-ids.constants';

const buttonsWith = (...down: (typeof SDL_BUTTON_NAMES)[number][]): boolean[] =>
  SDL_BUTTON_NAMES.map((name) => down.includes(name));

const NO_AXES = SDL_AXIS_NAMES.map(() => 0);

describe('the SDL to slot mapping', () => {
  it('reports every Tessera slot', () => {
    const { slots } = padStateOf(buttonsWith(), NO_AXES);
    expect(Object.keys(slots).sort()).toEqual([...CONTROLLER_SLOT_IDS].sort());
  });

  it('puts each SDL button in its physical slot', () => {
    const pairs = [
      ['SOUTH', 'face.south'], ['EAST', 'face.east'], ['WEST', 'face.west'], ['NORTH', 'face.north'],
      ['DPAD_UP', 'dpad.up'], ['DPAD_DOWN', 'dpad.down'], ['DPAD_LEFT', 'dpad.left'], ['DPAD_RIGHT', 'dpad.right'],
      ['LEFT_SHOULDER', 'shoulder.left'], ['RIGHT_SHOULDER', 'shoulder.right'],
      ['LEFT_STICK', 'stick.left.click'], ['RIGHT_STICK', 'stick.right.click'],
      ['BACK', 'meta.view'], ['START', 'meta.menu'], ['GUIDE', 'meta.guide'], ['MISC1', 'meta.capture'],
    ] as const;
    for (const [button, slot] of pairs) {
      const { slots, extras } = padStateOf(buttonsWith(button), NO_AXES);
      const lit = CONTROLLER_SLOT_IDS.filter((id) => slots[id]?.pressed === true);
      expect(lit, button).toEqual([slot]);
      expect(extras.some((extra) => extra.pressed === true), button).toBe(false);
    }
  });

  it('reads triggers as 0..1 values', () => {
    const { slots } = padStateOf(buttonsWith(), [0, 0, 0, 0, 0.25, 1]);
    expect(slots['trigger.left']).toEqual({ value: 0.25 });
    expect(slots['trigger.right']).toEqual({ value: 1 });
  });

  it('reads sticks with up as positive Y', () => {
    const { slots } = padStateOf(buttonsWith(), [0.5, -1, -0.25, 0.75, 0, 0]);
    expect(slots['stick.left']).toEqual({ x: 0.5, y: 1 });
    expect(slots['stick.right']).toEqual({ x: -0.25, y: -0.75 });
  });

  it('never reports negative zero', () => {
    const { slots } = padStateOf(buttonsWith(), NO_AXES);
    expect(Object.is(slots['stick.left']?.y, 0)).toBe(true);
  });

  it('reads an empty state as idle', () => {
    const { slots, extras } = padStateOf([], []);
    expect(slots['face.south']).toEqual({ pressed: false });
    expect(slots['stick.right']).toEqual({ x: 0, y: 0 });
    expect(slots['trigger.left']).toEqual({ value: 0 });
    expect(extras.every((extra) => extra.pressed === false)).toBe(true);
  });
});

describe('the SDL to extras mapping', () => {
  it('reports the ten extras apart from the slots, with plain labels', () => {
    const { extras } = padStateOf(buttonsWith(), NO_AXES);
    expect(extras.map((extra) => extra.id)).toEqual([
      'extra.misc2', 'extra.misc3', 'extra.misc4', 'extra.misc5', 'extra.misc6',
      'extra.paddle.right1', 'extra.paddle.left1', 'extra.paddle.right2', 'extra.paddle.left2', 'extra.touchpad',
    ]);
    expect(extras.find((extra) => extra.id === 'extra.paddle.right1')).toEqual({ id: 'extra.paddle.right1', label: 'Paddle R1', pressed: false });
    expect(extras.find((extra) => extra.id === 'extra.misc2')?.label).toBe('Misc 2');
  });

  it('puts each extra SDL button in its own extra and no slot', () => {
    const labels: Record<string, string> = {
      TOUCHPAD: 'Touchpad', MISC2: 'Misc 2', MISC3: 'Misc 3', MISC4: 'Misc 4', MISC5: 'Misc 5', MISC6: 'Misc 6',
      RIGHT_PADDLE1: 'Paddle R1', LEFT_PADDLE1: 'Paddle L1', RIGHT_PADDLE2: 'Paddle R2', LEFT_PADDLE2: 'Paddle L2',
    };
    for (const [button, label] of Object.entries(labels)) {
      const { slots, extras } = padStateOf(buttonsWith(button as (typeof SDL_BUTTON_NAMES)[number]), NO_AXES);
      expect(extras.filter((extra) => extra.pressed === true).map((extra) => extra.label), button).toEqual([label]);
      expect(CONTROLLER_SLOT_IDS.some((id) => slots[id]?.pressed === true), button).toBe(false);
    }
  });
});

const extraLabels = (family: PadFamily, hasButton: boolean[]): string[] =>
  padStateOf(buttonsWith(), NO_AXES, { family, hasButton }).extras.map((extra) => extra.label);

describe('extras limited to what the device has', () => {
  const BASE = ['SOUTH', 'EAST', 'WEST', 'NORTH', 'MISC1'] as const;

  it('lists no paddle extras for a pad without paddles', () => {
    const extras = padStateOf(buttonsWith(), NO_AXES, { family: 'xbox', hasButton: buttonsWith(...BASE) }).extras;
    expect(extras).toEqual([]);
  });

  it('lists only the touchpad for a pad that has one', () => {
    const extras = padStateOf(buttonsWith('TOUCHPAD'), NO_AXES, { family: 'playstation', hasButton: buttonsWith(...BASE, 'TOUCHPAD') }).extras;
    expect(extras).toEqual([{ id: 'extra.touchpad', label: 'Touchpad', pressed: true }]);
  });

  it('labels the paddles by family', () => {
    const paddles = ['RIGHT_PADDLE1', 'RIGHT_PADDLE2', 'LEFT_PADDLE1', 'LEFT_PADDLE2'] as const;
    const has = buttonsWith(...paddles);
    expect(extraLabels('xbox', has)).toEqual(['P1', 'P3', 'P2', 'P4']);
    expect(extraLabels('playstation', has)).toEqual(['RB', 'LB', 'Right Fn', 'Left Fn']);
    expect(extraLabels('nintendo', has)).toEqual(['GR', 'GL', 'Paddle R2', 'Paddle L2']);
    expect(extraLabels('generic', has)).toEqual(['Paddle R1', 'Paddle L1', 'Paddle R2', 'Paddle L2']);
  });

  it('keeps the ids stable across families', () => {
    const ids = (family: PadFamily): string[] => padStateOf(buttonsWith(), NO_AXES, { family, hasButton: buttonsWith('RIGHT_PADDLE1', 'MISC2') }).extras.map((extra) => extra.id);
    expect(ids('xbox')).toEqual(['extra.misc2', 'extra.paddle.right1']);
    expect(ids('nintendo')).toEqual(ids('xbox'));
  });

  it('lists all ten extras when the device sent no capabilities', () => {
    expect(padStateOf(buttonsWith(), NO_AXES, { family: 'xbox' }).extras).toHaveLength(10);
    expect(padStateOf(buttonsWith(), NO_AXES, { family: 'xbox', hasButton: [] }).extras).toHaveLength(10);
    expect(padStateOf(buttonsWith(), NO_AXES, { hasButton: [] }).extras.at(5)?.label).toBe('Paddle R1');
  });

  it('uses the capabilities of the device the subscription heard about', () => {
    const entry = { deviceKey: 'a:b', hasButton: buttonsWith(...BASE), family: 'xbox' } as DeviceEntry;
    let emit: ControllerStateListener = () => undefined;
    const pads: number[] = [];
    const subscribe = padStateSubscription({
      onState: (listener) => { emit = listener; return () => undefined; },
      onDevices: (listener) => { listener([entry]); return () => undefined; },
      list: () => Promise.resolve([]),
    });
    subscribe((_deviceKey, state) => pads.push(state.extras.length));
    emit('a:b', buttonsWith(), NO_AXES);
    emit('c:d', buttonsWith(), NO_AXES);
    expect(pads).toEqual([0, 10]);
  });
});

describe('the SDL gamepad type to family mapping', () => {
  it('maps every SDL type', () => {
    const byFamily: Record<string, ControllerGamepadType[]> = {
      generic: ['unknown', 'standard'],
      xbox: ['xbox360', 'xboxone'],
      playstation: ['ps3', 'ps4', 'ps5'],
      nintendo: ['switch-pro', 'joycon-left', 'joycon-right', 'joycon-pair', 'gamecube'],
    };
    for (const [family, types] of Object.entries(byFamily)) {
      for (const type of types) expect(padFamilyOf(type), type).toBe(family);
    }
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
