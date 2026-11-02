/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core/ipc';
import type { EventContractOf, InvokeContractOf } from '@drizztdourden08/brock-core/ipc';
import { channelName } from '../src/main/ipc/channel-name';

const TEST_CHANNELS = defineChannels({
  probeCount: invoke<(step: number) => Promise<number>>()('channel-test:count'),
  onProbe: event<(count: number) => void>()('channel-test:probed'),
});

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract extends InvokeContractOf<typeof TEST_CHANNELS> {}
  interface EventContract extends EventContractOf<typeof TEST_CHANNELS> {}
}

describe('K2 typed handles from a channel declaration', { tags: ['critical'] }, () => {
  it('registers by the declared channel string', () => {
    expect(channelName(TEST_CHANNELS.probeCount)).toBe('channel-test:count');
    expect(channelName('channel-test:count')).toBe('channel-test:count');
  });

});
