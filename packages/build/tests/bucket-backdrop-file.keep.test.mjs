/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { renderScreensFiles } from '../src/screens/render-screens.mjs';
import { checkScreens } from '../src/screens/check-screens.mjs';
import { dirname, join } from 'node:path';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const config = (backdrop = '') => `import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'library', title: 'Library', icon: 'book-open', menu: 'entry'${backdrop} },
    { id: 'notes', title: 'Notes', icon: 'file-text', menu: 'entry' },
  ],
  home: 'library',
});
`;

const PAGE = 'const Page = () => null;\n\nexport default Page;\n';
const BACKDROP = "const LibraryBackdrop = () => <div className=\"library-backdrop\" />;\n\nexport default LibraryBackdrop;\n";

const roots = [];

const appWith = (files, screensConfig = config()) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-backdrop-'));
  roots.push(root);
  for (const [path, content] of Object.entries({ 'src/screens/screens.config.ts': screensConfig, 'src/screens/notes/list.page.tsx': PAGE, ...files })) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const screensTs = (root) => renderScreensFiles(root).find((file) => file.path === '.brock/screens.ts')?.content ?? '';
const searchTs = (root) => renderScreensFiles(root).find((file) => file.path === '.brock/search.ts')?.content ?? '';

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 a bucket backdrop file', { tags: ['critical'] }, () => {
  it('syncs <bucket>.backdrop.tsx as a lazy backdrop entry of its bucket, left out of search', async () => {
    const root = appWith({ 'src/screens/library/shelf.page.tsx': PAGE, 'src/screens/library/library.backdrop.tsx': BACKDROP });
    const screens = screensTs(root);
    expect(screens).toContain("{ kind: 'backdrop', bucket: 'library', id: 'library', component: lazyComponent(() => import('../src/screens/library/library.backdrop')) },");
    expect(screens).not.toContain("from '../src/screens/library/library.backdrop'");
    expect(searchTs(root)).not.toContain('backdrop');
    expect(await checkScreens(root)).toEqual([]);
  });

  it('takes the bucket name, sits in the bucket folder and is never the only file of a bucket', async () => {
    const root = appWith({
      'src/screens/library/shelf.page.tsx': PAGE,
      'src/screens/library/wall.backdrop.tsx': BACKDROP,
      'src/screens/notes/drafts/notes.backdrop.tsx': BACKDROP,
      'src/screens/library.backdrop.tsx': BACKDROP,
    });
    const findings = await checkScreens(root);
    expect(findings).toContain('src/screens/library/wall.backdrop.tsx: a bucket backdrop takes the bucket name; rename it library.backdrop.tsx');
    expect(findings.some((line) => line.startsWith('src/screens/notes/drafts/notes.backdrop.tsx: a bucket backdrop sits directly in its bucket folder'))).toBe(true);
    expect(findings.some((line) => line.startsWith('src/screens/library.backdrop.tsx: a bucket backdrop sits directly in its bucket folder'))).toBe(true);
    const lonely = appWith({ 'src/screens/library/library.backdrop.tsx': BACKDROP });
    expect(await checkScreens(lonely)).toContain('src/screens/library: a bucket folder with no screens');
  });

  it('reports a bucket that also sets backdrop in screens.config.ts', async () => {
    const root = appWith({ 'src/screens/library/shelf.page.tsx': PAGE, 'src/screens/library/library.backdrop.tsx': BACKDROP }, config(", backdrop: { kind: 'color', color: '--c-secondary' }"));
    expect(await checkScreens(root)).toEqual(['src/screens/library/library.backdrop.tsx: bucket "library" also sets backdrop in screens.config.ts; keep one of them']);
  });

  it('keeps a page named after its bucket apart from the backdrop and takes a constants file', async () => {
    const root = appWith({
      'src/screens/library/library.page.tsx': PAGE,
      'src/screens/library/library.backdrop.tsx': BACKDROP,
      'src/screens/library/library.backdrop.constants.ts': "const STARS = 12;\n\nexport { STARS };\n",
    });
    expect(await checkScreens(root)).toEqual([]);
    expect(screensTs(root)).not.toContain('library.backdrop.constants');
  });
});

const HEADER = "const LibraryHeader = () => null;\nconst actions = () => null;\n\nexport default LibraryHeader;\nexport { actions };\n";

describe('K2 a bucket header file', { tags: ['critical'] }, () => {
  it('syncs <bucket>.header.tsx as a lazy header entry with its actions, left out of search', async () => {
    const root = appWith({ 'src/screens/library/shelf.page.tsx': PAGE, 'src/screens/library/library.header.tsx': HEADER });
    const screens = screensTs(root);
    expect(screens).toContain("{ kind: 'header', bucket: 'library', id: 'library', component: lazyComponent(() => import('../src/screens/library/library.header')), actions: lazyComponent(() => import('../src/screens/library/library.header').then((module) => ({ default: module.actions }))) },");
    expect(searchTs(root)).not.toContain('header');
    expect(await checkScreens(root)).toEqual([]);
  });

  it('leaves actions out when the file exports none', () => {
    const root = appWith({ 'src/screens/library/shelf.page.tsx': PAGE, 'src/screens/library/library.header.tsx': 'const Header = () => null;\n\nexport default Header;\n' });
    expect(screensTs(root)).toContain("{ kind: 'header', bucket: 'library', id: 'library', component: lazyComponent(() => import('../src/screens/library/library.header')) },");
  });

  it('takes the bucket name, sits in the bucket folder and is never the only file of a bucket', async () => {
    const root = appWith({
      'src/screens/library/shelf.page.tsx': PAGE,
      'src/screens/library/wall.header.tsx': HEADER,
      'src/screens/notes/drafts/notes.header.tsx': HEADER,
    });
    const findings = await checkScreens(root);
    expect(findings).toContain('src/screens/library/wall.header.tsx: a bucket header takes the bucket name; rename it library.header.tsx');
    expect(findings.some((line) => line.startsWith('src/screens/notes/drafts/notes.header.tsx: a bucket header sits directly in its bucket folder'))).toBe(true);
    const lonely = appWith({ 'src/screens/library/library.header.tsx': HEADER });
    expect(await checkScreens(lonely)).toContain('src/screens/library: a bucket folder with no screens');
  });

  it('reports a bucket that also sets header in screens.config.ts', async () => {
    const root = appWith({ 'src/screens/library/shelf.page.tsx': PAGE, 'src/screens/library/library.header.tsx': HEADER }, config(", header: { render: 'x' }"));
    expect(await checkScreens(root)).toEqual(['src/screens/library/library.header.tsx: bucket "library" also sets header in screens.config.ts; keep one of them']);
  });
});
