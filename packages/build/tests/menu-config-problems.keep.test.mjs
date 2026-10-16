/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { menuConfigProblems, menuConfigWarnings } from '../src/menu/menu-config-problems.mjs';

const CONFIG = `import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [{ id: 'tools', title: 'Tools', icon: 'wrench', menu: 'submenu' }],
  home: 'tools',
});
`;

const PAGE = 'const Page = () => null;\n\nexport default Page;\n';

const roots = [];

const appWith = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-menu-'));
  roots.push(root);
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
};

const APP = {
  'src/screens/screens.config.ts': CONFIG,
  'src/screens/tools/notes.page.tsx': PAGE,
  'src/screens/tools/clock/face.tab.tsx': PAGE,
  'src/screens/glossary.card.tsx': PAGE,
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('menuConfigProblems', () => {
  it('passes a valid config, and no config at all', () => {
    const root = appWith(APP);
    expect(menuConfigProblems(root, undefined)).toEqual([]);
    expect(menuConfigProblems(root, { entries: {
      settings: { label: 'Preferences', before: 'about' },
      'bucket:tools:notes': { parent: null, group: 'main' },
      'bucket:tools:clock': { order: 2 },
      'screen:glossary': { hidden: true },
      'check-updates': { after: 'credits' },
      view: { label: 'Window' },
    } })).toEqual([]);
  });

  it('names bad fields, screen keys the app lacks, self references and loops', () => {
    const root = appWith(APP);
    expect(menuConfigProblems(root, { entries: {
      settings: { label: '', colour: 'red' },
      'bucket:tools:notez': { hidden: true },
      profiles: { before: 'profiles' },
      'screen:glossary': { after: 'about', before: 'bucket:tools' },
      home: { before: 'credits' },
      credits: { after: 'home' },
      view: { hidden: true, parent: 'section:advanced' },
    } })).toEqual([
      'brock.config.ts product.menu: entries["settings"].label must be a non-empty text',
      'brock.config.ts product.menu: entries["settings"] has an unknown field "colour"',
      'brock.config.ts product.menu: entries["bucket:tools:notez"] names no screen of src/screens',
      'brock.config.ts product.menu: entries["profiles"].before names the entry itself',
      'brock.config.ts product.menu: entries["screen:glossary"] sets both before and after; before is used',
      'brock.config.ts product.menu: entries.view takes no parent; the View sub-menu sits at the top level of the menu',
      'brock.config.ts product.menu: entries home > credits > home name each other in before and after, so none of them moves',
    ]);
  });

  it('moves and hides View like any entry', () => {
    const root = appWith(APP);
    expect(menuConfigProblems(root, { entries: { view: { group: 'end', order: -1 } } })).toEqual([]);
    expect(menuConfigProblems(root, { entries: { view: { before: 'about' } } })).toEqual([]);
    expect(menuConfigProblems(root, { entries: { view: { hidden: true } } })).toEqual([]);
  });

  it('takes the Pin on top and Full screen keys, with activeLabel on these two only', () => {
    const hidden = { hidden: true };
    const root = appWith(APP);
    expect(menuConfigProblems(root, { entries: { view: hidden, 'window-pin': { label: 'Keep on top', activeLabel: 'Stop keeping on top', after: 'about' }, 'window-fullscreen': hidden } })).toEqual([]);
    expect(menuConfigProblems(root, { entries: { about: { activeLabel: 'Shown' }, 'window-pin': { activeLabel: '' } } })).toEqual([
      'brock.config.ts product.menu: entries["window-pin"].activeLabel must be a non-empty text',
      'brock.config.ts product.menu: entries["about"].activeLabel applies only to entries["window-pin"] and entries["window-fullscreen"]',
    ]);
  });

  it('rejects a menu that is not an entries object', () => {
    expect(menuConfigProblems(appWith(APP), { entries: [] })).toEqual(['brock.config.ts product.menu: must be { entries: { <key>: { ... } } }']);
  });
});

describe('menuConfigWarnings', () => {
  const hidden = { hidden: true };

  it('warns when View, Pin on top and Full screen are all out of the menu', () => {
    expect(menuConfigWarnings({ entries: { view: hidden } })).toEqual([]);
    expect(menuConfigWarnings({ entries: { view: hidden, 'window-pin': hidden } })).toEqual([]);
    expect(menuConfigWarnings({ entries: { view: { inMenu: false }, 'window-pin': hidden, 'window-fullscreen': { inMenu: false } } })).toEqual([
      'brock.config.ts product.menu: entries.view, entries["window-pin"] and entries["window-fullscreen"] are all out of the menu, so on a narrow window, where the title bar tucks its pin and full screen buttons away, nothing reaches them',
    ]);
    expect(menuConfigWarnings(undefined)).toEqual([]);
  });

  it('warns that the Pin on top and Full screen keys do nothing while View is shown', () => {
    expect(menuConfigWarnings({ entries: { view: { label: 'Window' }, 'window-pin': { label: 'Keep on top' } } })).toEqual([
      'brock.config.ts product.menu: entries["window-pin"] has no effect while View is shown; it renames, moves or hides the tucked row in the main menu only when entries.view is hidden',
    ]);
    expect(menuConfigWarnings({ entries: { 'window-pin': hidden, 'window-fullscreen': hidden } })).toHaveLength(2);
  });
});
