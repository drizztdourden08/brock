/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { templateIcons } from '../src/template-brand.mjs';
import { locateTemplate } from '../src/template.mjs';

const made = [];

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const templateWith = (config) => {
  const dir = mkdtempSync(join(tmpdir(), 'create-brock-brand-'));
  made.push(dir);
  writeFileSync(join(dir, 'brock.config.ts'), config);
  return dir;
};

describe('templateIcons', () => {
  it('gives the first sync the brand of the shipped template, so a new app gets its palette', () => {
    expect(templateIcons(locateTemplate())).toEqual({ brand: 'brock' });
  });

  it('gives no brand when the template sets none', () => {
    expect(templateIcons(templateWith("export default { product: { icons: {} }, modules: [] };\n"))).toEqual({});
    expect(templateIcons(templateWith("export default { product: { icons: { brand: \"atlas\", rim: 'dark' } } };\n"))).toEqual({ brand: 'atlas' });
  });
});
