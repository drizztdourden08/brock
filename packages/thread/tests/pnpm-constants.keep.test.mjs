/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { NO_PURGE_PROMPT } from '../src/pnpm.constants.mjs';

describe('the pnpm purge prompt flag', { tags: ['critical'] }, () => {
  it('uses the kebab key, the only spelling pnpm reads from --config', () => {
    expect(NO_PURGE_PROMPT).toBe('--config.confirm-modules-purge=false');
  });
});
