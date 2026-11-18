/* @layer core @kind logic */
import type { Tags } from './format/env.type';
import type { TagMap } from './i18n.type';

const adaptTags = <T>(tags: TagMap<T>): Tags =>
  Object.fromEntries(
    Object.entries(tags).map(([name, fn]) => [name, (chunks: readonly unknown[]) => fn(chunks as readonly (string | T)[])]),
  );

export { adaptTags };
