/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ask, defineChannels, invoke } from '@drizztdourden08/brock-core/ipc';
import { channelApi } from '../src/host/channel-api';

const CHANNELS = defineChannels({
  addNote: invoke<(text: string) => Promise<number>>()('chan-test:add'),
  readDoc: ask<(id: string) => Promise<string>>()('chan-test:read'),
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('channelApi with ask channels', () => {
  it('accepts a set that holds ask channels, since the renderer answers them and the preload never maps them', () => {
    const api = { addNote: vi.fn() };
    vi.stubGlobal('window', { api });
    expect(channelApi(CHANNELS)).toBe(api);
  });

  it('still names an invoke method the preload does not expose', () => {
    vi.stubGlobal('window', { api: {} });
    expect(() => channelApi(CHANNELS)).toThrow('window.api has no addNote');
  });
});
