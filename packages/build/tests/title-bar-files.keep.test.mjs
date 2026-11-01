/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkTitleBar } from '../src/title-bar/check-title-bar.mjs';
import { renderTitleBarFiles } from '../src/title-bar/render-title-bar.mjs';

const dirs = [];

const appDir = (files) => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-title-bar-'));
  dirs.push(dir);
  writeFileSync(join(dir, 'brock.config.ts'), 'export default {};\n');
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('K1 renderTitleBar', { tags: ['critical'] }, () => {
  it('writes an empty list for an app with no src/title-bar, and skips files with no default export', () => {
    expect(renderTitleBarFiles(appDir({}))[0]?.content).toContain('titleBarFromFiles([])');
    const dir = appDir({ 'src/title-bar/rooms.action.ts': 'export default defineTitleBarItem({});\n', 'src/title-bar/half.action.ts': 'const x = 1;\n' });
    expect(renderTitleBarFiles(dir)[0]?.content).toContain("{ id: 'rooms', source: roomsItem }");
    expect(renderTitleBarFiles(dir)[0]?.content).not.toContain('half');
  });

  it('carries an order export, or meta.order, into the list', () => {
    const dir = appDir({
      'src/title-bar/rooms.action.ts': 'export default defineTitleBarItem({});\nexport const order = 2;\n',
      'src/title-bar/sync-status.action.ts': 'const meta = { order: 1 };\nexport default defineTitleBarItem({});\nexport { meta };\n',
      'src/title-bar/plain.action.ts': 'export default defineTitleBarItem({});\n',
    });
    const content = renderTitleBarFiles(dir)[0]?.content ?? '';
    expect(content).toContain("import roomsItem, { order as roomsOrder } from '../src/title-bar/rooms.action';");
    expect(content).toContain("import syncStatusItem, { meta as syncStatusMeta } from '../src/title-bar/sync-status.action';");
    expect(content).toContain("{ id: 'rooms', source: roomsItem, order: roomsOrder },");
    expect(content).toContain("{ id: 'sync-status', source: syncStatusItem, order: syncStatusMeta.order },");
    expect(content).toContain("{ id: 'plain', source: plainItem },");
  });
});

describe('K1 checkTitleBar', { tags: ['critical'] }, () => {
  it('reports strays, folders, bad ids, missing default exports and standard ids', () => {
    const dir = appDir({
      'src/title-bar/rooms.action.ts': 'export default x;\n',
      'src/title-bar/helpers.ts': 'export const y = 1;\n',
      'src/title-bar/parts/a.ts': '',
      'src/title-bar/Bad.action.ts': 'export default x;\n',
      'src/title-bar/empty.action.ts': 'const x = 1;\n',
      'src/title-bar/search.action.ts': 'export default x;\n',
    });
    const findings = checkTitleBar(dir).join('\n');
    expect(findings).toContain('src/title-bar/helpers.ts: not a title bar item file');
    expect(findings).toContain('src/title-bar/parts: src/title-bar holds title bar item files and their constants files only');
    expect(findings).toContain('"Bad" is not a kebab-case id');
    expect(findings).toContain('src/title-bar/empty.action.ts: no default export');
    expect(findings).toContain('"search" is a standard Brock title bar item id');
    expect(findings).not.toContain('rooms.action.ts');
  });
});
