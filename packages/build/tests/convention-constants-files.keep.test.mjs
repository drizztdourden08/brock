/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectFindings } from '@drizztdourden08/standards/structure';
import brockApp from '../standards.extension.mjs';
import { scanScreens } from '../src/screens/scan-screens.mjs';
import { renderWidgetsFiles } from '../src/widgets/render-widgets.mjs';

const roots = [];

const app = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-constants-'));
  roots.push(root);
  for (const [file, content] of Object.entries({ 'package.json': '{ "name": "app" }', 'brock.config.ts': '', 'src/main.tsx': '', ...files })) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  return root;
};

const findingsOf = async (root) => (await collectFindings(root, '@app', [brockApp])).findings;

const pathsOf = (findings) => findings.map((finding) => finding.split(': ')[0]).sort();

const PAGE = 'const Page = () => null;\nexport default Page;\n';

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 constants files in the convention folders', { tags: ['critical'] }, () => {
  it('src/widgets takes the file lint names beside a widget and the layout, and a shared one, and sync leaves them out', async () => {
    const root = app({
      'src/widgets/notes.widget.tsx': "import { POLL_MS } from './notes.widget.constants';\nconst Notes = () => null;\nexport default Notes;\n",
      'src/widgets/notes.widget.constants.ts': 'const POLL_MS = 1000;\nexport { POLL_MS };\n',
      'src/widgets/layout.ts': 'export default defineLayoutPreset({ rows: [] });\n',
      'src/widgets/layout.constants.ts': '',
      'src/widgets/widget-sizes.constants.ts': '',
      'src/widgets/Sizes.constants.ts': '',
      'src/widgets/notes.widget.type.ts': '',
    });
    const findings = await findingsOf(root);
    expect(pathsOf(findings)).toEqual(['src/widgets/Sizes.constants.ts', 'src/widgets/notes.widget.type.ts']);
    expect(findings.find((finding) => finding.startsWith('src/widgets/Sizes'))).toContain('<id>.widget.constants.ts');
    const written = renderWidgetsFiles(root)[0]?.content ?? '';
    expect(written).toContain("import('../src/widgets/notes.widget')");
    expect(written).not.toContain('constants');
  });
});

describe('K1 constants files in the screen folder', { tags: ['critical'] }, () => {
  it('src/screens takes the file lint names beside a screen of every kind, and a shared one, at every level, and the scan leaves them out', () => {
    const root = app({
      'src/screens/game/home.hero.tsx': PAGE,
      'src/screens/game/home.hero.constants.ts': 'const COLUMNS = 3;\nexport { COLUMNS };\n',
      'src/screens/game/saves.page.tsx': PAGE,
      'src/screens/game/saves.page.constants.ts': '',
      'src/screens/game/general.settings.ts': 'export default [];\n',
      'src/screens/game/general.settings.constants.ts': '',
      'src/screens/game/tracker/items.tab.tsx': PAGE,
      'src/screens/game/tracker/items.tab.constants.ts': '',
      'src/screens/game/tracker/tracker.constants.ts': '',
      'src/screens/game/game-labels.constants.ts': '',
      'src/screens/credits.card.tsx': PAGE,
      'src/screens/credits.card.constants.ts': '',
      'src/screens/playfield.layer.constants.ts': '',
      'src/screens/Shared.constants.ts': '',
      'src/screens/game/saves.page.type.ts': '',
    });
    const { files, findings } = scanScreens(root);
    expect(pathsOf(findings)).toEqual(['src/screens/Shared.constants.ts', 'src/screens/game/saves.page.type.ts']);
    expect(findings.find((finding) => finding.startsWith('src/screens/Shared'))).toContain('library.page.constants.ts');
    expect(files.map((file) => file.path).sort()).toEqual([
      'src/screens/credits.card.tsx', 'src/screens/game/general.settings.ts', 'src/screens/game/home.hero.tsx', 'src/screens/game/saves.page.tsx',
      'src/screens/game/tracker/items.tab.tsx',
    ]);
  });
});
