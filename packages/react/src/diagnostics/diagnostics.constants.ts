/* @layer renderer-shell @kind constants */
import type { HostShell, OsKind } from '@drizztdourden08/brock-core';

const HOST_LABEL: Record<HostShell, string> = {
  electron: 'Electron',
  capacitor: 'Capacitor',
  web: 'Web',
};

const OS_LABEL: Record<OsKind, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  unknown: 'Unknown',
};

const BYTES_PER_GIB = 1024 ** 3;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;
const MHZ_PER_GHZ = 1000;
const DEBUG_LOG_TAIL = 30;
const DEBUG_LOG_LINE_MAX = 200;
const FALLBACK_VERSION = '0.0.0';
const NO_VALUE = '-';

export {
  BYTES_PER_GIB, DEBUG_LOG_LINE_MAX, DEBUG_LOG_TAIL, FALLBACK_VERSION, HOST_LABEL, MHZ_PER_GHZ, NO_VALUE, OS_LABEL,
  SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE,
};
