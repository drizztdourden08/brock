/* @layer tooling-scripts @kind test */
import { describe, expect, expectTypeOf, it } from 'vitest';
import type { BrockConfig, BrockWorkflowOptions, WorkflowAttest, WorkflowPublish } from '../src/config.mjs';

describe('workflow options in brock.config.ts', () => {
  const config = {
    product: { id: 'atlas', name: 'Atlas', appId: 'dev.atlas.app', author: { name: 'Atlas Games' } },
    targets: ['desktop'],
    modules: [],
    workflows: {
      attest: { paths: ['upload/*.zip'], stage: 'afterPackage' },
      publish: { packages: ['packages/client-kit'], registry: 'github' },
    },
  } satisfies BrockConfig;

  it('types attest and publish on the workflows option', () => {
    expectTypeOf<BrockWorkflowOptions['attest']>().toEqualTypeOf<WorkflowAttest | undefined>();
    expectTypeOf<BrockWorkflowOptions['publish']>().toEqualTypeOf<WorkflowPublish | undefined>();
    expectTypeOf(config.workflows.publish.packages).toEqualTypeOf<string[]>();
    expect(config.workflows.attest.stage).toBe('afterPackage');
  });

  it('refuses a publish registry other than github and an attest stage Brock does not know', () => {
    expectTypeOf<{ packages: string[]; registry: 'npm' }>().not.toExtend<WorkflowPublish>();
    expectTypeOf<{ paths: string[]; stage: 'later' }>().not.toExtend<WorkflowAttest>();
  });
});
