/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const WIDGETS = [
  "import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';",
  'const update = useWidgetLayoutStore((s) => s.update);',
  "const shown = useWidgetLayoutStore.getState().layout.widgets.some((w) => w.id === 'logs');",
  'const overlays = <StandardOverlays menu={menu} widgets={extra} />;',
  '',
].join('\n');

const HERO = [
  'const Home = ({ slots }: HeroProps) => (',
  '  <>',
  '    <slots.Backdrop>',
  '      <Text variant="title">Game</Text>',
  '    </slots.Backdrop>',
  '    <Backdrop>',
  '      <Text variant="title">Game</Text>',
  '    </Backdrop>',
  '    <Facts>',
  '      <StatRow label="Version" value={version} />',
  '    </Facts>',
  '  </>',
  ');',
  '',
].join('\n');

const roots: string[] = [];

const sampleApp = (file: string, source: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-dock-hero-'));
  roots.push(root);
  const target = join(root, ...file.split('/'));
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, source);
  return root;
};

const only = (id: string) => selectMigrations(collectMigrations([]), { from: '0.1.0', to: null }).filter((m) => m.file.endsWith(`${id}.mjs`));

afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('widget-layout-v2', () => {
  it('turns every use of the flat widget layout into a to-do and leaves the file alone', async () => {
    const root = sampleApp('src/widgets.tsx', WIDGETS);
    const run = await runMigrations(root, only('widget-layout-v2'));
    expect(readFileSync(join(root, 'src', 'widgets.tsx'), 'utf8')).toBe(WIDGETS);
    expect(run.todos.map((todo) => todo.line)).toEqual([2, 3, 4]);
    expect(run.todos[1]?.message).toContain('isWidgetOpen');
    const again = await runMigrations(root, only('widget-layout-v2'));
    expect(again.todos).toHaveLength(3);
  });
});

describe('hero-slots', () => {
  it('flags Facts children and a heading inside Backdrop in hero pages only', async () => {
    const root = sampleApp('src/screens/game/home.hero.tsx', HERO);
    writeFileSync(join(root, 'src', 'screens', 'game', 'notes.page.tsx'), HERO);
    const run = await runMigrations(root, only('hero-slots'));
    expect(run.todos.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/screens/game/home.hero.tsx:9', 'src/screens/game/home.hero.tsx:6']);
    expect(readFileSync(join(root, 'src', 'screens', 'game', 'home.hero.tsx'), 'utf8')).toBe(HERO);
  });
});
