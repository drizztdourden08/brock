/* @layer electron-main @kind constants */
import type { JobStepDef } from '@drizztdourden08/brock-core/types';

const MODULE_ID = 'tools';
const DATA_DIR = 'tools';
const DEFAULT_VERSION = 'current';
const TOOL_ID = /^[a-z0-9][a-z0-9-]{0,40}$/;
const BINARY_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const SHA256_HEX = /^[0-9a-f]{64}$/i;
const DOWNLOAD_PROTOCOLS = ['http:', 'https:'];
const TOOL_OSES: readonly string[] = ['win32', 'darwin', 'linux'];
const TOOL_ARCHES: readonly string[] = ['x64', 'arm64'];
const RUN_TIMEOUT_MS = 10 * 60_000;
const INSTALL_STEPS: JobStepDef[] = [
  { id: 'download', label: 'Download', weight: 8 },
  { id: 'verify', label: 'Verify', weight: 1 },
  { id: 'extract', label: 'Unpack', weight: 1 },
];

export {
  MODULE_ID, DATA_DIR, DEFAULT_VERSION, TOOL_ID, BINARY_NAME, SHA256_HEX, DOWNLOAD_PROTOCOLS, TOOL_OSES, TOOL_ARCHES, RUN_TIMEOUT_MS, INSTALL_STEPS,
};
