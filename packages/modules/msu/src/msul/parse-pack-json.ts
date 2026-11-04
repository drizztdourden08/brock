/* @layer core @kind logic */
import { MSUL_MANIFEST_NAME } from '../manifest-io';
import type { MsuPackManifest } from '../types';
import { isManifestShape } from './is-manifest-shape';

const parsePackJson = (text: string): MsuPackManifest => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`This pack's ${MSUL_MANIFEST_NAME} is not valid JSON. The file may be damaged.`);
  }
  const version = (parsed as { version?: unknown } | null)?.version;
  if (version !== 1) {
    throw new Error(
      `This pack declares format version ${String(version ?? 'unknown')}, which this version of the app cannot read.`,
    );
  }
  if (!isManifestShape(parsed)) {
    throw new Error(`This pack's ${MSUL_MANIFEST_NAME} is missing its pack details or track list.`);
  }
  return parsed;
};

export { parsePackJson };
