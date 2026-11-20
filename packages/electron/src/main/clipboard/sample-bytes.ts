/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { SAMPLE_BYTES } from './fingerprint.constants';

const sampleBytes = (bytes: Uint8Array): string => `${bytes.length}:${createHash('sha1').update(bytes.subarray(0, SAMPLE_BYTES)).digest('hex')}`;

export { sampleBytes };
