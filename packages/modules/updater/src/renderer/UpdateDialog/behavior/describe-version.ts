/* @layer renderer-shell @kind logic */
import type { VersionOption } from '../../../updater.type';
import { formatBytes } from './format-bytes';

const stateOf = ({ installed, downgrade }: VersionOption): string => {
  if (installed) return 'installed';
  return downgrade ? 'older than installed' : '';
};

const describeVersion = (version: VersionOption): string => {
  const date = version.releaseDate ? new Date(version.releaseDate).toLocaleDateString() : '';
  return [formatBytes(version.downloadSize), date, stateOf(version), version.prerelease ? 'pre-release' : '']
    .filter((part) => part.length > 0)
    .join(' · ');
};

export { describeVersion };
