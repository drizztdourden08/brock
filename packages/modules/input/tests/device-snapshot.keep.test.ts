/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { HidListedDevice } from '../src/device.type';
import type { LiveDevice } from '../src/devices/live-device.type';
import { buildDeviceSnapshot } from '../src/devices/build-device-snapshot';

const XINPUT_GUID = '030000005e040000ff02000000007800';
const HIDAPI_GUID = '050000004c050000e60c000000006800';

const livePad = (deviceKey: string, vendorId: number, productId: number, guid: string): LiveDevice => ({
  deviceKey, name: 'Pad', sdlId: 1, vendorId, productId, guid, mapping: null, hasRumble: true, hasGyro: false,
  connectionState: 'unknown', sdlType: 'xboxone', hasButton: [], hasAxis: [], buttonLabels: [],
});

const xboxFace = (xinput: boolean): HidListedDevice => ({
  vendorId: 0x045e, productId: 0x0b13, product: 'Xbox Wireless Controller', busType: 'bluetooth', xinput,
});

const keysOf = (live: LiveDevice[], listed: HidListedDevice[]) =>
  buildDeviceSnapshot(new Map(live.map((device) => [device.deviceKey, device])), listed)
    .map((entry) => `${entry.deviceKey} ${entry.status}`);

describe('the device snapshot', () => {
  it('lists a Bluetooth Xbox pad once when its HID face shares a container with XInput', () => {
    const pad = livePad('045e:02ff', 0x045e, 0x02ff, XINPUT_GUID);
    expect(keysOf([pad], [xboxFace(true)])).toEqual(['045e:02ff ready']);
  });

  it('keeps two real XInput pads as two entries', () => {
    const first = livePad('045e:02ff', 0x045e, 0x02ff, XINPUT_GUID);
    const second = { ...livePad('045e:02ff#2', 0x045e, 0x02ff, XINPUT_GUID), sdlId: 2 };
    expect(keysOf([first, second], [xboxFace(true)])).toEqual(['045e:02ff ready', '045e:02ff#2 ready']);
  });

  it('still lists a HID face as unavailable when no XInput pad is open to claim it', () => {
    expect(keysOf([], [xboxFace(true)])).toEqual(['045e:0b13 unavailable']);
  });

  it('never folds a HID device that shares no container with XInput', () => {
    const pad = livePad('045e:02ff', 0x045e, 0x02ff, XINPUT_GUID);
    expect(keysOf([pad], [xboxFace(false)])).toEqual(['045e:02ff ready', '045e:0b13 unavailable']);
  });

  it('does not let a pad SDL opened through HIDAPI claim a face', () => {
    const pad = livePad('054c:0ce6', 0x054c, 0x0ce6, HIDAPI_GUID);
    expect(keysOf([pad], [xboxFace(true)])).toEqual(['054c:0ce6 ready', '045e:0b13 unavailable']);
  });

  it('lets an exact vid:pid match claim its own listing first', () => {
    const pad = livePad('045e:0b13', 0x045e, 0x0b13, XINPUT_GUID);
    expect(keysOf([pad], [xboxFace(true)])).toEqual(['045e:0b13 ready']);
  });

  it('keeps the xinput mark out of an unavailable entry', () => {
    const [entry] = buildDeviceSnapshot(new Map(), [xboxFace(true)]);
    expect(entry).not.toHaveProperty('xinput');
  });
});
