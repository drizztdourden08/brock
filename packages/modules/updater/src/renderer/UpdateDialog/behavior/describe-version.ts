/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { VersionOption } from '../../../updater.type';
import { formatBytes } from './format-bytes';

const stateOf = ({ installed, downgrade }: VersionOption, text: (value: Text) => string): string => {
  if (installed) return text(msg('updater:version.installed'));
  return downgrade ? text(msg('updater:version.older')) : '';
};

const describeVersion = (version: VersionOption, text: (value: Text) => string): string => {
  const prerelease = version.prerelease ? text(msg('updater:version.prerelease')) : '';
  return [formatBytes(version.downloadSize), formatDate(version.releaseDate, 'date'), stateOf(version, text), prerelease]
    .filter((part) => part.length > 0)
    .join(' · ');
};

export { describeVersion };
