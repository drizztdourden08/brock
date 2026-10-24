/* @layer tooling-scripts @kind test */
import { describe, expect, expectTypeOf, it } from 'vitest';
import type { BrockConfig } from '../src/config.mjs';

describe('server options in brock.config.ts', () => {
  const config = {
    product: { id: 'atlas', name: 'Atlas', appId: 'dev.atlas.app', author: { name: 'Atlas Games' } },
    targets: ['desktop', 'server'],
    modules: [],
    server: { entry: 'server/main.ts', osPackages: ['bubblewrap'], ports: [8080], arch: ['x64'], optionalAddons: ['ssh2', 'cpu-features'] },
    workflows: { testEnv: { linuxPackages: ['bubblewrap'], userNamespaces: true } },
  } satisfies BrockConfig;

  it('types every server option the build reads, optionalAddons included', () => {
    expectTypeOf(config.server.optionalAddons).toEqualTypeOf<string[]>();
    expect(config.server.optionalAddons).toEqual(['ssh2', 'cpu-features']);
  });
});
