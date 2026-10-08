/* @layer electron-main @kind logic */
import type { CatalogGrant } from '../catalog.type';
import type { CatalogGrantRules as GrantRules } from './catalog-config.type';

const capOf = ({ maxBytes }: GrantRules, grant: CatalogGrant): number => {
  if (typeof maxBytes === 'function') return maxBytes(grant);
  return maxBytes ?? Number.POSITIVE_INFINITY;
};

const checkGrant = (grant: CatalogGrant, itemId: string, rules: GrantRules): void => {
  if (grant.itemId !== itemId) throw new Error(`${rules.label} answered for a different item.`);
  if (!rules.installers[grant.container]) throw new Error(`${rules.label} answered with a kind of file this app cannot install (${grant.container}).`);
  if (!(grant.bytes > 0) || grant.bytes > capOf(rules, grant)) throw new Error(`The item is larger than ${rules.label} allows.`);
  if (!grant.url.startsWith('https://')) throw new Error(`${rules.label} answered with a download that is not secure.`);
};

export { checkGrant };
