/* @layer tooling-scripts @kind logic */
import { compareVersions } from '@drizztdourden08/brock-thread';

/**
 * @template {{ version: string, source: string, file: string }} T
 * @param {T[]} migrations
 * @param {{ from: string, to: string | null }} range from excluded, to included; null is open
 * @returns {T[]} in version order
 */
const selectMigrations = (migrations, { from, to }) =>
  migrations
    .filter(({ version }) => compareVersions(version, from) > 0 && (to === null || compareVersions(version, to) <= 0))
    .sort((a, b) => compareVersions(a.version, b.version) || a.source.localeCompare(b.source) || a.file.localeCompare(b.file));

export { selectMigrations };
