/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { targetTrack } from '../src/player/target-track';
import type { MsuGameConfig } from '../src/config/msu-game-config.type';

const config: MsuGameConfig<{ area: number }> = {
  id: 'demo',
  packRoot: 'msu',
  soundChannels: [],
  soundIdCount: 8,
  trackLoops: () => true,
  classifyMusic: (ctrl) => ({ kind: 'track', track: ctrl }),
  resumePath: () => 'resume.json',
  variants: { night: { remapTrack: (track, context) => track + context.area * 100 } },
};

describe('targetTrack', { tags: ['critical'] }, () => {
  it('keeps the track when no variant is chosen', () => {
    expect(targetTrack(config, undefined, 5, { area: 2 })).toBe(5);
  });

  it('lets the chosen variant remap the track from the game context', () => {
    expect(targetTrack(config, 'night', 5, { area: 2 })).toBe(205);
  });

  it('keeps the track for a variant the config does not know', () => {
    expect(targetTrack(config, 'storm', 5, { area: 2 })).toBe(5);
  });
});
