/* @layer renderer-shell @kind logic */
import { settingsBucketOf } from './settings-bucket-of';
import type { ScreensConfig } from './screens-config.type';
import type { ScreenEntry } from './screen-tree.type';

const problemsOf = (config: ScreensConfig, entries: readonly ScreenEntry[]): string[] => {
  const ids = config.buckets.map((bucket) => bucket.id);
  const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
  const undeclared = [...new Set(entries.flatMap((entry) => ('bucket' in entry && !ids.includes(entry.bucket) ? [entry.bucket] : [])))];
  const settings = settingsBucketOf(config);
  return [
    ...repeated.map((id) => `bucket "${id}" is declared twice`),
    ...(ids.includes(config.home) ? [] : [`home "${config.home}" is not a declared bucket`]),
    ...(ids.includes(settings) ? [] : [`settings.bucket "${settings}" is not a declared bucket`]),
    ...undeclared.map((id) => `src/screens/${id} is not a bucket declared in screens.config.ts`),
    ...entries.filter((entry) => entry.kind === 'base' && ids.includes(entry.id)).map((entry) => `the base screen "${entry.id}" has the id of a bucket`),
  ];
};

const assertScreensConfig = (config: ScreensConfig, entries: readonly ScreenEntry[]): void => {
  const problems = problemsOf(config, entries);
  if (problems.length > 0) throw new Error(`screens.config.ts: ${problems.join('; ')}.`);
};

export { assertScreensConfig };
