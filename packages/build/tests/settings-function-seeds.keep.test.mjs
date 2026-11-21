/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { readDefaultResult } from '../src/screens/literal/read-default-result.mjs';
import { settingsSeeds } from '../src/screens/search/settings-seeds.mjs';

const ROW = "{ key: 'volume', label: 'Volume', description: 'Level.', hint: 'Drag to set the level.' }";

const seedsOf = (source) => settingsSeeds(readDefaultResult(source)).map((section) => [section.id, section.rows.map((row) => row.key)]);

describe('K1 the function form of a .settings.ts page', { tags: ['critical'] }, () => {
  it('keeps the rows of an arrow that returns the sections', () => {
    const source = `export default (settings: AppSettings): Section[] => [\n  { id: 'audio', title: 'Audio', items: [${ROW}, { key: 'mute', label: 'Mute', disabled: settings.volume === 0 }] },\n];\n`;
    expect(seedsOf(source)).toEqual([['audio', ['volume', 'mute']]]);
  });

  it('keeps the rows of a named function with a block body', () => {
    const source = `const page = (settings: AppSettings): Section[] => {\n  const extra = settings.debug;\n  return [{ id: 'audio', title: 'Audio', items: [${ROW}] }];\n};\nexport default page;\n`;
    expect(seedsOf(source)).toEqual([['audio', ['volume']]]);
  });

  it('follows a returned constant', () => {
    const source = `const sections: Section[] = [{ id: 'audio', title: 'Audio', items: [${ROW}] }];\nexport default (settings: AppSettings) => sections;\n`;
    expect(seedsOf(source)).toEqual([['audio', ['volume']]]);
  });

  it('keeps the key of a msg() title, label and hint in place of a string', () => {
    const source = "export default (settings: AppSettings): Section[] => [{ id: 'audio', title: msg('app:audio'), items: [{ key: 'volume', label: msg('app:volume'), hint: msg('app:volumeHint') }] }];\n";
    expect(settingsSeeds(readDefaultResult(source))).toEqual([
      { id: 'audio', title: { key: 'app:audio' }, rows: [{ key: 'volume', label: { key: 'app:volume' }, description: undefined, hint: { key: 'app:volumeHint' }, keywords: [] }] },
    ]);
  });

  it('reads nothing from a body it cannot follow', () => {
    expect(seedsOf('export default (settings: AppSettings) => build(settings);\n')).toEqual([]);
  });
});
