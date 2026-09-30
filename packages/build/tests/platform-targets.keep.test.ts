/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { addTarget } from '../src/platforms/add-target.mjs';
import { expandTargets } from '../src/platforms/expand-targets.mjs';
import { removeTarget } from '../src/platforms/remove-target.mjs';
import { readTargets, writeTargets } from '../src/platforms/targets-source.mjs';

describe('expandTargets', () => {
  it('expands the bundles into ids, in canonical order, once each', () => {
    expect(expandTargets(['web', 'desktop', 'mobile', 'linux']).platforms).toEqual(['windows', 'macos', 'linux', 'android', 'web']);
  });

  it('keeps the reserved ios id and reports unknown words', () => {
    expect(expandTargets(['ios', 'playstation'])).toEqual({ platforms: ['ios'], unknown: ['playstation'] });
  });

  it('leaves ios out of mobile until it is supported', () => {
    expect(expandTargets(['mobile']).platforms).toEqual(['android']);
  });
});

describe('addTarget and removeTarget', () => {
  it('adds an id once and keeps a bundle as written', () => {
    expect(addTarget(['desktop'], 'android')).toEqual(['desktop', 'android']);
    expect(addTarget(['desktop'], 'windows')).toEqual(['desktop']);
    expect(addTarget(['android', 'web'], 'mobile')).toEqual(['web', 'mobile']);
  });

  it('writes a bundle that loses a member as its other members', () => {
    expect(removeTarget(['desktop', 'web'], 'linux')).toEqual(['windows', 'macos', 'web']);
    expect(removeTarget(['desktop', 'mobile'], 'mobile')).toEqual(['desktop']);
    expect(removeTarget(['windows', 'macos', 'linux'], 'desktop')).toEqual([]);
  });
});

describe('readTargets and writeTargets', () => {
  const source = "export default defineBrockConfig({\n  product: { id: 'a' },\n  targets: ['desktop'],\n  modules: ['updater'],\n});\n";

  it('reads and rewrites the targets array only', () => {
    expect(readTargets(source)).toEqual(['desktop']);
    const next = writeTargets(source, ['desktop', 'mobile', 'web']);
    expect(readTargets(next)).toEqual(['desktop', 'mobile', 'web']);
    expect(next).toContain("modules: ['updater']");
  });

  it('writes a targets array beside modules when there is none', () => {
    const bare = source.replace("  targets: ['desktop'],\n", '');
    expect(readTargets(bare)).toBeNull();
    expect(writeTargets(bare, ['web'])).toContain("  targets: ['web'],\n  modules:");
  });
});
