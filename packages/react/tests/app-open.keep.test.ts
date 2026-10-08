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
