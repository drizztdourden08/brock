/* @layer electron-main @kind logic */
import type { SentSelector } from './recording-main.type';

const selectRecordings: SentSelector = (payload) => {
  const ref = payload.extras?.['recordings'] as { scope?: unknown; keys?: unknown } | undefined;
  if (typeof ref?.scope !== 'string' || !Array.isArray(ref.keys)) return null;
  return { scope: ref.scope, keys: ref.keys.filter((key): key is string => typeof key === 'string') };
};

export { selectRecordings };
