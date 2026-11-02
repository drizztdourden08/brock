/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineChannels, event, invoke, send } from '../src/ipc';

interface Status {
  state: 'ready' | 'building';
}

const CHANNELS = defineChannels({
  engineStatus: invoke<() => Promise<Status>>()('test:engine:status'),
  engineSetup: invoke<(force: boolean) => Promise<Status>>()('test:engine:setup'),
  ping: send<(text: string) => void>()('test:ping'),
  onProgress: event<(fraction: number) => void>()('test:engine:progress'),
});

describe('K2 defineChannels', { tags: ['critical'] }, () => {
  it('builds the three method maps from one declaration', () => {
    expect(CHANNELS.maps).toEqual({
      invoke: { engineStatus: 'test:engine:status', engineSetup: 'test:engine:setup' },
      send: { ping: 'test:ping' },
      events: { onProgress: 'test:engine:progress' },
    });
    expect(CHANNELS.engineStatus).toEqual({ kind: 'invoke', channel: 'test:engine:status' });
  });

});
