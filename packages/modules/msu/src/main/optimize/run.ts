/* @layer electron-main @kind logic */
import { writeManifest } from '../../edit';
import { withFileRenamed } from '../../layer-edit';
import { listAudioFiles } from '../../packs';
import type { OptimizeConversion, OptimizeRunResult } from '../../optimize';
import { withSupersededRepointed } from '../../superseded';
import { carryLoopPoints } from './carry-loop-points';
import { convertFile } from './convert-file';
import { manifestToEdit } from './manifest-to-edit';
import type { OptimizeEnv } from './optimize-env.type';
import { pendingConversions } from './pack-audio';

const convertPack = async (env: OptimizeEnv, pack: string, fileNames: string[]): Promise<OptimizeRunResult> => {
  const audio = await listAudioFiles(env.game, env.files, pack);
  const sizes = new Map(audio.map((file) => [file.name, file.size]));
  const manifest = await manifestToEdit(env, pack, [...sizes.keys()]);
  const pending = new Set(pendingConversions(audio).map((file) => file.name));
  const wanted = fileNames.filter((name) => pending.has(name));
  const taken = new Set(sizes.keys());

  const carriedLoops = await carryLoopPoints(env, pack, wanted, manifest);
  let working = carriedLoops.manifest;
  await writeManifest(env.game, env.files, pack, working);

  const converted: OptimizeConversion[] = [];
  const failed: Array<{ name: string; reason: string }> = [];

  for (const [index, name] of wanted.entries()) {
    const step = { pack, phase: 'convert' as const, index: index + 1, total: wanted.length, fileName: name };
    env.report(step);
    const outcome = await convertFile({ env, step, sizeBytes: sizes.get(name) ?? 0, taken });
    if (!outcome.ok) {
      failed.push(outcome.failure);
      continue;
    }
    converted.push(outcome.conversion);
    taken.add(outcome.conversion.outputName);
    working = withFileRenamed(working, name, outcome.conversion.outputName);
    await writeManifest(env.game, env.files, pack, working);
  }

  const reconciled = withSupersededRepointed(working, [...taken]);
  if (reconciled !== working) await writeManifest(env.game, env.files, pack, reconciled);

  return { converted, failed, loopPointsCarried: carriedLoops.carried };
};

export { convertPack };
