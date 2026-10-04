/* @layer tooling-scripts @kind test */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { afterEach, describe, expect, it } from 'vitest';

const HOME = [
  'const Home = ({ slots }: HeroProps) => (',
  '  <>',
  '    <slots.Art src={mark} alt="" />',
  '    <Art kind="node" node={<Scene />} />',
  '    <Backdrop>',
  '      <Scene />',
  '    </Backdrop>',
  '  </>',
  ');',
  '',
].join('\n');

const made: string[] = [];
const heroKinds = () => selectMigrations(collectMigrations([]), { from: '0.11.0', to: '0.12.0' }).filter((m) => m.file.endsWith('hero-kinds.mjs'));

const homeApp = (source: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-hero-kinds-'));
  made.push(root);
  writeFileSync(join(root, 'package.json'), '{"name":"x"}');
  mkdirSync(join(root, 'src', 'screens', 'game'), { recursive: true });
  writeFileSync(join(root, 'src', 'screens', 'game', 'home.hero.tsx'), source);
  return root;
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('hero-kinds', () => {
  it('names the image kind on art without one and turns a Backdrop with children into a to-do', async () => {
    const root = homeApp(HOME);
    const run = await runMigrations(root, heroKinds());
    const home = readFileSync(join(root, 'src', 'screens', 'game', 'home.hero.tsx'), 'utf8');
    expect(home).toContain('<slots.Art kind="image" src={mark} alt="" />');
    expect(home).toContain('<Art kind="node" node={<Scene />} />');
    expect(run.todos.map(({ line }) => line)).toEqual([5]);
  });
});
