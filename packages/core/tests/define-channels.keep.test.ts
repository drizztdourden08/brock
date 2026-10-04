/* @layer core @kind test */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineChannels, event, invoke, send } from '../src/ipc';
import type { ChannelApi, EventContractOf, InvokeContractOf, SendContractOf } from '../src/ipc';

interface Status {
  state: 'ready' | 'building';
}

const CHANNELS = defineChannels({
  engineStatus: invoke<() => Promise<Status>>()('test:engine:status'),
  engineSetup: invoke<(force: boolean) => Promise<Status>>()('test:engine:setup'),
  ping: send<(text: string) => void>()('test:ping'),
  onProgress: event<(fraction: number) => void>()('test:engine:progress'),
});

interface ProbeInvoke extends InvokeContractOf<typeof CHANNELS> {}

describe('defineChannels', () => {
  it('builds the three method maps from one declaration', () => {
    expect(CHANNELS.maps).toEqual({
      invoke: { engineStatus: 'test:engine:status', engineSetup: 'test:engine:setup' },
      send: { ping: 'test:ping' },
      events: { onProgress: 'test:engine:progress' },
    });
    expect(CHANNELS.engineStatus).toEqual({ kind: 'invoke', channel: 'test:engine:status' });
  });

  it('yields the contract types keyed by channel, for the augmentation', () => {
    expectTypeOf<ProbeInvoke['test:engine:status']>().toEqualTypeOf<() => Promise<Status>>();
    expectTypeOf<InvokeContractOf<typeof CHANNELS>>().toEqualTypeOf<{ 'test:engine:status': () => Promise<Status>; 'test:engine:setup': (force: boolean) => Promise<Status> }>();
    expectTypeOf<SendContractOf<typeof CHANNELS>>().toEqualTypeOf<{ 'test:ping': (text: string) => void }>();
    expectTypeOf<EventContractOf<typeof CHANNELS>>().toEqualTypeOf<{ 'test:engine:progress': (fraction: number) => void }>();
    expectTypeOf(CHANNELS.maps.invoke.engineSetup).toEqualTypeOf<'test:engine:setup'>();
  });

  it('types the renderer methods by name: calls for invoke and send, subscriptions for events', () => {
    type Api = ChannelApi<typeof CHANNELS>;
    expectTypeOf<Api['engineSetup']>().toEqualTypeOf<(force: boolean) => Promise<Status>>();
    expectTypeOf<Api['ping']>().toEqualTypeOf<(text: string) => void>();
    expectTypeOf<Api['onProgress']>().toEqualTypeOf<(cb: (fraction: number) => void) => () => void>();
    expectTypeOf<Api>().not.toHaveProperty('maps');
  });
});
