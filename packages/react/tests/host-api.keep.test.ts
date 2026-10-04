/* @layer renderer-shell @kind test */
import { describe, expectTypeOf, it } from 'vitest';
import type { IpcApi } from '@drizztdourden08/brock-core';
import { hostApi } from '../src/host/host-api';

describe('hostApi', () => {
  it('stays the base api without type arguments', () => {
    expectTypeOf(hostApi()).toEqualTypeOf<IpcApi | null>();
  });

  it('adds the app maps it is given', () => {
    const api = hostApi<{ invoke: { getVersion: 'app:getVersion' }; events: { onLog: 'log:entry' } }>();
    expectTypeOf(api).not.toBeAny();
    expectTypeOf<NonNullable<typeof api>>().toHaveProperty('getVersion');
    expectTypeOf<NonNullable<typeof api>>().toHaveProperty('onLog');
    expectTypeOf<NonNullable<typeof api>>().toHaveProperty('isDev');
  });
});
