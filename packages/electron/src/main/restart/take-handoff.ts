/* @layer electron-main @kind logic */
import { readFileSync, rmSync } from 'fs';
import { isJsonValue } from '@drizztdourden08/brock-core/ipc';
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import { HANDOFF_ENVELOPE_BYTES, HANDOFF_MAX_BYTES, HANDOFF_TTL_MS } from './restart.constants';

const readText = (file: string): string | null => {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};

const envelopeOf = (text: string): { writtenAt?: unknown; value?: unknown } | null => {
  if (Buffer.byteLength(text) > HANDOFF_MAX_BYTES + HANDOFF_ENVELOPE_BYTES) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const valueOf = (text: string, now: number): JsonValue | null => {
  const { writtenAt, value } = envelopeOf(text) ?? {};
  if (typeof writtenAt !== 'number' || !Number.isFinite(writtenAt)) return null;
  if (now < writtenAt || now - writtenAt >= HANDOFF_TTL_MS) return null;
  return isJsonValue(value) ? value : null;
};

const takeHandoff = (file: string, now: () => number = Date.now): JsonValue | null => {
  const text = readText(file);
  if (text === null) return null;
  rmSync(file, { force: true });
  return valueOf(text, now());
};

export { takeHandoff };
