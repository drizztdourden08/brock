/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { MsuGameConfig } from '../src/config/msu-game-config.type';
import type { MsuHost } from '../src/config/msu-host.type';
import { publishSoundClaims } from '../src/msu-sound-claims/publish-sound-claims';
import { demoConfig } from './demo-config.fixture';
import type { MsuPackManifest } from '../src/types';

const channels: MsuGameConfig['soundChannels'] = [
  { name: 'bed', kind: 'stateful', bus: 'ambient', coreIndex: 4, previewSeconds: 30 },
  { name: 'fx-a', kind: 'additive', bus: 'sfx', coreIndex: 7, previewSeconds: 10 },
  { name: 'fx-b', kind: 'additive', bus: 'sfx', coreIndex: 9, previewSeconds: 10 },
];

const config = demoConfig(channels);

const manifest: MsuPackManifest = {
  version: 1,
  meta: { name: 'demo', createdAt: 0, modifiedAt: 0 },
  tracks: [],
  sounds: {
    'fx-a': [{ soundId: 3, layers: [{ id: 'l1', name: 'hit', files: ['hit.wav'], mode: { kind: 'once' }, volume: 1 }] }],
  },
};

const fakeHost = (): MsuHost => ({
  audioTarget: () => null,
  setExternalMusic: vi.fn(),
  restoreCoreMusic: vi.fn(),
  setSoundClaim: vi.fn(),
  setExternalSounds: vi.fn(),
});

describe('publishSoundClaims', { tags: ['critical'] }, () => {
  it('sets one claim per configured channel with its core index', () => {
    const host = fakeHost();
    publishSoundClaims(host, config, manifest, { ambient: true, sfx: true });
    const calls = vi.mocked(host.setSoundClaim).mock.calls;
    expect(calls.map((call) => call[0])).toEqual([4, 7, 9]);
    expect(calls[1]).toEqual([7, 1 << 3, 0]);
  });

  it('claims nothing on a bus that is not allowed', () => {
    const host = fakeHost();
    const claimed = publishSoundClaims(host, config, manifest, { ambient: true, sfx: false });
    expect(claimed).toEqual({ ambient: 0, sfx: 0 });
    expect(vi.mocked(host.setSoundClaim).mock.calls.every((call) => call[1] === 0 && call[2] === 0)).toBe(true);
  });
});
