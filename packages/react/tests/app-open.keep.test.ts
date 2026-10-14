/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { OpenRequest } from '@drizztdourden08/brock-core';
import { createAppOpenRegistry } from '../src/open/create-app-open-registry';

const FILE: OpenRequest = { kind: 'file', path: '/packs/theme.mypack', ext: 'mypack', source: 'launch' };

describe('createAppOpenRegistry', () => {
  it('holds a request that arrives before any handler and hands it to the first one', () => {
    const registry = createAppOpenRegistry();
    registry.dispatch(FILE);
    const seen: OpenRequest[] = [];
    registry.on((request) => seen.push(request));
    expect(seen).toEqual([FILE]);
  });

  it('hands held requests to every handler that subscribes before the hold ends', () => {
    const ends: Array<() => void> = [];
    const registry = createAppOpenRegistry((flush) => { ends.push(flush); });
    registry.dispatch(FILE);
    const first: OpenRequest[] = [];
    const second: OpenRequest[] = [];
    const late: OpenRequest[] = [];
    registry.on((request) => first.push(request));
    registry.on((request) => second.push(request));
    expect(ends).toHaveLength(1);
    for (const end of ends) end();
    registry.on((request) => late.push(request));
    expect(first).toEqual([FILE]);
    expect(second).toEqual([FILE]);
    expect(late).toEqual([]);
  });

  it('ends the hold on the next task by default', async () => {
    const registry = createAppOpenRegistry();
    registry.dispatch(FILE);
    const first: OpenRequest[] = [];
    const late: OpenRequest[] = [];
    registry.on((request) => first.push(request));
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    registry.on((request) => late.push(request));
    expect(first).toEqual([FILE]);
    expect(late).toEqual([]);
  });

  it('gives each later request to every handler until it unsubscribes', () => {
    const registry = createAppOpenRegistry();
    const first: OpenRequest[] = [];
    const second: OpenRequest[] = [];
    const stop = registry.on((request) => first.push(request));
    registry.on((request) => second.push(request));
    registry.dispatch(FILE);
    stop();
    registry.dispatch(FILE);
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(2);
  });
});
