/* @layer electron-main @kind logic */
import { isJsonValue } from '@drizztdourden08/brock-core/ipc';
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import { writePrivateFile } from '../bridge/write-private-file';
import { HANDOFF_MAX_BYTES, HANDOFF_NOT_JSON, HANDOFF_TOO_LARGE } from './restart.constants';
import type { HandoffEnvelope } from './restart.type';

const writeHandoff = (file: string, value: JsonValue, now: () => number = Date.now): void => {
  if (!isJsonValue(value)) throw new TypeError(HANDOFF_NOT_JSON);
  if (Buffer.byteLength(JSON.stringify(value)) > HANDOFF_MAX_BYTES) throw new RangeError(HANDOFF_TOO_LARGE);
  const envelope: HandoffEnvelope = { writtenAt: now(), value };
  writePrivateFile(file, JSON.stringify(envelope));
};

export { writeHandoff };
