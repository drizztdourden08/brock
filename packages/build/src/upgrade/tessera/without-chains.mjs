/* @layer tooling-scripts @kind logic */
import { RENAME_MAPS } from './tessera-renames.constants.mjs';

const isChain = (map, value) =>
  typeof value === 'string' && !value.includes('(') && value.split(' ').some((name) => name !== '' && Object.hasOwn(map, name));

const flatMaps = (group, map) =>
  group === 'propValues'
    ? Object.entries(map).map(([owner, values]) => ({ label: `propValues ${owner}`, map: values ?? {} }))
    : [{ label: group, map }];

const chainsOf = (release) =>
  RENAME_MAPS.filter((group) => release[group] && group !== 'removedExports')
    .flatMap((group) => flatMaps(group, release[group]))
    .flatMap(({ label, map }) => Object.entries(map).filter(([, value]) => isChain(map, value)).map(([key, value]) => ({ label, key, value })));

const dropKey = (map, key) => Object.fromEntries(Object.entries(map).filter(([name]) => name !== key));

const dropChain = (release, { label, key }) => {
  const [group, owner] = label.split(' ');
  if (!owner) return { ...release, [group]: dropKey(release[group], key) };
  return { ...release, propValues: { ...release.propValues, [owner]: dropKey(release.propValues[owner], key) } };
};

/**
 * @param {Record<string, any>} release
 * @returns {{ release: Record<string, any>, warnings: string[] }} without the entries that chain
 */
const withoutChains = (release) => {
  const chains = chainsOf(release);
  return {
    release: chains.reduce(dropChain, release),
    warnings: chains.map(({ label, key, value }) =>
      `Tessera ${release.version} ${label}: ${key} -> ${value} is skipped, because ${value} is also renamed in the same release; a second replay would rename it again.`),
  };
};

export { withoutChains };
