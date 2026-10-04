/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { hasGuideParts } from '../src/tessera/has-guide-parts.mjs';

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const withConfig = (config) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-guide-parts-'));
  roots.push(root);
  if (config !== undefined) writeFileSync(join(root, 'tessera.config.json'), typeof config === 'string' ? config : JSON.stringify(config));
  return root;
};

describe('hasGuideParts', () => {
  it('is set by guide.parts at the root or in an apps entry', () => {
    expect(hasGuideParts(withConfig({ guide: { parts: 'src/guide/parts.type.ts' } }))).toBe(true);
    expect(hasGuideParts(withConfig({ apps: { 'apps/desktop': { guide: { parts: 'apps/desktop/src/guide/parts.type.ts' } } } }))).toBe(true);
  });

  it('is not set without guide.parts, without a config or with a config that does not parse', () => {
    expect(hasGuideParts(withConfig({ guide: { usage: 'report' } }))).toBe(false);
    expect(hasGuideParts(withConfig(undefined))).toBe(false);
    expect(hasGuideParts(withConfig('{ not json'))).toBe(false);
  });
});
