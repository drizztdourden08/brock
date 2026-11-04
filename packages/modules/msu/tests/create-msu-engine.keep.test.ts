/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createMsuEngine } from '../src/player/create-msu-engine';
import type { MsuGameConfig } from '../src/config/msu-game-config.type';
import type { MsuPackManifest } from '../src/types';

const fakeGain = () => ({
  gain: {
    value: 1,
    cancelScheduledValues: () => undefined,
    setValueAtTime: () => undefined,
    linearRampToValueAtTime: () => undefined,
  },
  connect: () => undefined,
  disconnect: () => undefined,
});

const fakeContext = { currentTime: 0, createGain: fakeGain } as unknown as BaseAudioContext;
const fakeDestination = {} as AudioNode;

const trackDef = (trackNum: number): MsuPackManifest['tracks'][number] => ({
  trackNum,
  layers: [{ id: `l${trackNum}`, name: 'main', files: [`track-${trackNum}.opus`], mode: { kind: 'loop', order: 'single' }, volume: 1 }],
});

const manifest = {
  version: 1,
  meta: { name: 'demo' },
  tracks: [trackDef(1), trackDef(2), trackDef(3)],
} as MsuPackManifest;

const config: MsuGameConfig = {
  id: 'demo',
  packRoot: 'msu',
  soundChannels: [],
  soundIdCount: 8,
  trackLoops: () => true,
  classifyMusic: (ctrl) => (ctrl === 3 ? { kind: 'ignore' } : { kind: 'track', track: ctrl }),
  resumePath: () => 'resume.json',
};

const buildEngine = () => {
  const requested: string[] = [];
  const engine = createMsuEngine({
    ctx: fakeContext,
    destination: fakeDestination,
    manifest,
    loadBytes: (name) => { requested.push(name); return Promise.resolve(null); },
    config,
    musicVolume: () => 100,
  });
  return { engine, requested };
};

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

describe('createMsuEngine music commands', { tags: ['critical'] }, () => {
  it('starts the track a track command names', async () => {
    const { engine, requested } = buildEngine();
    engine.onMusicCtrl({ ctrl: 2, scene: 0, context: undefined });
    await settle();
    expect(requested).toEqual(['track-2.opus']);
  });

  it('leaves the current track alone when the classifier says ignore', async () => {
    const { engine, requested } = buildEngine();
    engine.onMusicCtrl({ ctrl: 1, scene: 0, context: undefined });
    await settle();
    engine.onMusicCtrl({ ctrl: 3, scene: 0, context: undefined });
    await settle();
    expect(requested).toEqual(['track-1.opus']);
  });
});
