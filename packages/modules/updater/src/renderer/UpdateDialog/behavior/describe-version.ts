/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { VersionOption } from '../../../updater.type';
import { formatBytes } from './format-bytes';

const stateOf = ({ installed, downgrade }: VersionOption): string => {
  if (installed) return 'installed';
  return downgrade ? 'older than installed' : '';
};

const describeVersion = (version: VersionOption): string => {
  return [formatBytes(version.downloadSize), formatDate(version.releaseDate, 'date'),stateOf(version), version.prerelease ? 'pre-release' : '']
    .filter((part) => part.length > 0)
    .join(' · ');
};

export { describeVersion };
