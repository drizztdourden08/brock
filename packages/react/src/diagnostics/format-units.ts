/* @layer renderer-shell @kind logic */
import {
  BYTES_PER_GIB, MHZ_PER_GHZ, NO_VALUE, SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_MINUTE,
} from './diagnostics.constants';

const gib = (bytes: number): string => `${(bytes / BYTES_PER_GIB).toFixed(1)} GiB`;

const ghz = (mhz: number): string => (mhz > 0 ? `${(mhz / MHZ_PER_GHZ).toFixed(2)} GHz` : 'unknown');

const duration = (seconds: number): string => {
  const days = Math.floor(seconds / SECONDS_PER_DAY);
  const hours = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const hex = (value: number): string => `0x${value.toString(16).toUpperCase().padStart(4, '0')}`;

const yesNo = (value: boolean): string => (value ? 'yes' : 'no');

const orDash = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === '' ? NO_VALUE : String(value);

const formatUnits = { gib, ghz, duration, hex, yesNo, orDash };

export { formatUnits };
