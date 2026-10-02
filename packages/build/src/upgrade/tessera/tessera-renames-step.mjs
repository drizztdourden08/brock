/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { relative } from 'node:path';
import { installedTessera } from './installed-tessera.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { replayRelease } from './replay-release.mjs';
import { selectReleases } from './select-releases.mjs';
import { tesseraFiles } from './tessera-files.mjs';
import { tesseraPin } from './tessera-pin.mjs';
import { GENERATED_MARK, NEXT_RELEASE, RENAMES_STEP_ID, SCRIPT_FILE, TESSERA_BASELINE, TESSERA_PACKAGE } from './tessera-renames.constants.mjs';
import { withoutChains } from './without-chains.mjs';

const SUMMARY = 'Tessera renamed custom properties, components, classes, props and prop values, and removed exports; RENAMES.json replays over the app code, and each note becomes a to-do.';

const readSources = (rootDir, files) =>
  files
    .map((file) => ({ file, path: relative(rootDir, file).replace(/\\/g, '/'), source: readFileSync(file, 'utf8') }))
    .filter(({ source }) => !GENERATED_MARK.test(source.slice(0, 300)));

const replay = (ts, sources, release) => {
  const touched = [];
  const todos = [];
  for (const item of sources) {
    const result = replayRelease(ts, item, release);
    if (result.source !== item.source) {
      writeFileSync(item.file, result.source, 'utf8');
      item.source = result.source;
      touched.push(item.path);
    }
    todos.push(...result.todos.map((todo) => ({ file: item.path, ...todo })));
  }
  return { id: RENAMES_STEP_ID, version: release.version, source: TESSERA_PACKAGE, summary: SUMMARY, touched, todos };
};

const startOf = (rootDir, from) => from ?? tesseraPin.read(rootDir) ?? TESSERA_BASELINE;

const nothing = (skipped) => ({ applied: [], warnings: [], skipped, pinned: null, range: null });

/**
 * @param {{ rootDir: string, from?: string | null }} ctx from: --tessera-from, the pin, else 0.3.0
 * @returns {{ applied: { id: string, version: string, touched: string[], todos: { file: string, line: number, message: string }[] }[], warnings: string[], skipped: string | null, pinned: string | null, range: { from: string, to: string, next: boolean } | null }} one entry per release
 */
const tesseraRenamesStep = ({ rootDir, from = null }) => {
  const tessera = installedTessera(rootDir);
  if (!tessera) return nothing(`${TESSERA_PACKAGE} is not installed`);
  if (!tessera.releases) return nothing(`the installed ${TESSERA_PACKAGE} ${tessera.version} has no RENAMES.json`);
  const range = { from: startOf(rootDir, from), to: tessera.version };
  const checked = selectReleases(tessera.releases, range).map(withoutChains);
  const ts = loadTypescript(rootDir);
  const warnings = [...checked.flatMap((item) => item.warnings), ...(ts ? [] : ['TypeScript is not installed, so the Tessera renames left the scripts alone.'])];
  const sources = checked.length > 0 ? readSources(rootDir, tesseraFiles(rootDir).filter((file) => ts || !SCRIPT_FILE.test(file))) : [];
  const applied = checked.map(({ release }) => replay(ts, sources, release));
  const pinned = tesseraPin.write(rootDir, tessera.version) ? tessera.version : null;
  return { applied, warnings, skipped: null, pinned, range: { ...range, next: checked.some(({ release }) => release.version === NEXT_RELEASE) } };
};

export { tesseraRenamesStep };
