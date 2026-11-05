/* @layer electron-main @kind logic */
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { OptimizeAnalysis, OptimizeCandidate } from '../../optimize';
import { listAudioFiles } from '../../packs';
import { packFilePath } from '../pack-fs';
import { measureCandidate } from './measure';
import type { OptimizeEnv } from './optimize-env.type';
import { pendingConversions } from './pack-audio';

const analyzePack = async (env: OptimizeEnv, pack: string): Promise<OptimizeAnalysis> => {
  const audio = await listAudioFiles(env.game, env.files, pack);
  const pending = pendingConversions(audio);
  const tempDir = await mkdtemp(join(tmpdir(), 'msu-optimize-'));
  try {
    const candidates: OptimizeCandidate[] = [];
    for (const [index, file] of pending.entries()) {
      env.report({ pack, phase: 'measure', index: index + 1, total: pending.length, fileName: file.name });
      candidates.push(await measureCandidate({
        env,
        pack,
        tempDir,
        filePath: packFilePath(env, pack, file.name),
        fileName: file.name,
        sizeBytes: file.size,
        index,
      }));
    }
    return { pack, candidates, alreadyTargetCount: audio.length - pending.length };
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
};

export { analyzePack };
