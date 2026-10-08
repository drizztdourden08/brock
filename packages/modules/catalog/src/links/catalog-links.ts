/* @layer core @kind logic */
import type { CatalogLink } from '../catalog.type';
import { LINK_HOST, LINK_SCHEME, MAX_LINK_CHARS, MAX_VERSION, VERSION_QUERY } from './catalog-links.constants';
import type { CatalogLinks } from './catalog-links.type';
import { isCatalogItemId } from './is-catalog-item-id';

const versionOf = (query: string | undefined): number | null | undefined => {
  if (query === undefined) return null;
  const match = VERSION_QUERY.exec(query);
  if (!match) return undefined;
  const version = Number(match[1]);
  return version <= MAX_VERSION ? version : undefined;
};

const splitQuery = (rest: string): [string, string | undefined] => {
  const at = rest.indexOf('?');
  return at === -1 ? [rest, undefined] : [rest.slice(0, at), rest.slice(at + 1)];
};

const createCatalogLinks = (scheme: string): CatalogLinks => {
  if (!LINK_SCHEME.test(scheme)) throw new Error(`Not a link scheme: ${scheme}`);
  const prefix = `${scheme}://${LINK_HOST}/`;

  const parse = (raw: string): CatalogLink | null => {
    const link = raw.trim();
    if (link.length > MAX_LINK_CHARS || link.includes('#') || link.slice(0, prefix.length).toLowerCase() !== prefix) return null;
    const [path, query] = splitQuery(link.slice(prefix.length));
    const itemId = path.endsWith('/') ? path.slice(0, -1) : path;
    const version = versionOf(query);
    return isCatalogItemId(itemId) && version !== undefined ? { itemId, version } : null;
  };

  const format = ({ itemId, version }: CatalogLink): string => {
    if (!isCatalogItemId(itemId)) throw new Error(`Not a catalog item id: ${itemId}`);
    if (version !== null && (!Number.isInteger(version) || version < 1 || version > MAX_VERSION)) throw new Error(`Not a version number: ${version}`);
    return `${prefix}${itemId}${version === null ? '' : `?v=${version}`}`;
  };

  const fromArgv = (argv: readonly string[]): CatalogLink | null => argv.map(parse).find((link) => link !== null) ?? null;

  return { scheme, parse, format, fromArgv };
};

export { createCatalogLinks };
