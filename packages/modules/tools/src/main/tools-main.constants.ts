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

const PROBE_ARGS: readonly string[] = ['--version'];
const PROBE_TIMEOUT_MS = 15_000;
const VERSION_PATTERN = /\d+(?:\.\d+)+/;
const PATH_TTL_MS = 2_000;
const REG_TIMEOUT_MS = 5_000;
const REG_PATH_KEYS: readonly string[] = [
  'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment',
  'HKCU\\Environment',
];

export {
  MODULE_ID, DATA_DIR, DEFAULT_VERSION, TOOL_ID, BINARY_NAME, SHA256_HEX, DOWNLOAD_PROTOCOLS, TOOL_OSES, TOOL_ARCHES, RUN_TIMEOUT_MS, INSTALL_STEPS,
  PROBE_ARGS, PROBE_TIMEOUT_MS, VERSION_PATTERN, PATH_TTL_MS, REG_TIMEOUT_MS, REG_PATH_KEYS,
};
