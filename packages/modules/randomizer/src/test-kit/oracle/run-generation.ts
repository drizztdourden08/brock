/* @layer core @kind logic */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { ApworldRigConfig, GenerationRun } from './apworld-rig.type';
import { generatorPath } from './generator-path';
import { GENERATE_TIMEOUT_MS, PLAYER_FILE } from './run-generation.constants';

const runGeneration = async (
  config: ApworldRigConfig, yaml: string, seed: number, extra: readonly string[],
): Promise<GenerationRun> => {
  const dir = mkdtempSync(path.join(tmpdir(), config.tempPrefix));
  try {
    const players = path.join(dir, 'players');
    const out = path.join(dir, 'out');
    mkdirSync(players);
    mkdirSync(out);
    writeFileSync(path.join(players, PLAYER_FILE), yaml);
    const run = spawnSync(generatorPath(config), [
      '--player_files_path', players, '--outputpath', out, '--seed', String(seed), '--spoiler', '2', ...extra,
    ], { input: '\n', encoding: 'utf8', timeout: GENERATE_TIMEOUT_MS, windowsHide: true });
    const log = `${run.stdout}${run.stderr}`;
    const archive = readdirSync(out).find((name) => name.endsWith('.zip'));
    if (archive === undefined) return { ok: false, log, spoiler: null };
    return { ok: true, log, spoiler: await config.readSpoiler(readFileSync(path.join(out, archive))) };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

export { runGeneration };
