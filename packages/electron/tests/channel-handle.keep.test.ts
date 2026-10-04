/* @layer electron-main @kind test */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core/ipc';
import type { EventContractOf, InvokeContractOf } from '@drizztdourden08/brock-core/ipc';
import type { InvokeHandler } from '../src/main/ipc/handle.type';
import type { EmitToWindow, MainContext } from '../src/main/types/main-context.type';
import { channelName } from '../src/main/ipc/channel-name';

const TEST_CHANNELS = defineChannels({
  probeCount: invoke<(step: number) => Promise<number>>()('channel-test:count'),
  onProbe: event<(count: number) => void>()('channel-test:probed'),
});

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract extends InvokeContractOf<typeof TEST_CHANNELS> {}
  interface EventContract extends EventContractOf<typeof TEST_CHANNELS> {}
}

describe('typed handles from a channel declaration', () => {
  it('registers by the declared channel string', () => {
    expect(channelName(TEST_CHANNELS.probeCount)).toBe('channel-test:count');
    expect(channelName('channel-test:count')).toBe('channel-test:count');
  });

  it('types handle and emit from the entry as from the string', () => {
    type Handle = MainContext['handle'];
    expectTypeOf<Parameters<Handle>[0]>().toExtend<string | { readonly channel: string }>();
    expectTypeOf<InvokeHandler<'channel-test:count'>>().parameter(1).toEqualTypeOf<number>();
    const handle: Handle = () => undefined;
    handle(TEST_CHANNELS.probeCount, (_event, step) => Promise.resolve(step + 1));
    handle('channel-test:count', (_event, step) => step + 1);
    const emit: EmitToWindow = () => undefined;
    emit(TEST_CHANNELS.onProbe, 3);
    // @ts-expect-error the event carries a number
    emit(TEST_CHANNELS.onProbe, 'three');
  });
});
