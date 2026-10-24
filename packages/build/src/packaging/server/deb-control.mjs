/* @layer tooling-scripts @kind logic */
import { DEB_EMAIL_PATTERN, DEB_VERSION_PATTERN } from '../../platforms/server/server.constants.mjs';
import { DEB_MAINTAINER_FALLBACK, DEB_SECTION } from './server-packaging.constants.mjs';

const oneLine = (text) => String(text).replace(/\s+/g, ' ').trim();

/**
 * @param {string} version an npm version
 * @returns {string} a Debian version, a prerelease sorting first
 */
const debVersion = (version) => {
  const converted = version.replace('-', '~').replace(/\+/g, '.');
  if (!DEB_VERSION_PATTERN.test(converted)) throw new Error(`package.json version "${version}" cannot be a Debian version.`);
  return converted;
};

const maintainerOf = (author) => {
  const name = oneLine(author.name);
  const email = oneLine(author.email ?? DEB_MAINTAINER_FALLBACK);
  if (/[<>,"]/.test(name) || !name) throw new Error(`product.author.name "${name}" cannot be a Debian maintainer name.`);
  if (!DEB_EMAIL_PATTERN.test(email)) throw new Error(`product.author.email "${email}" is not a plain address, so it cannot be the Debian maintainer.`);
  return `${name} <${email}>`;
};

/**
 * @param {{ id: string, version: string, arch: string, product: { name: string, description?: string, author: { name: string, email?: string } }, osPackages: string[], installedSizeKib: number }} spec
 * @returns {string} the DEBIAN/control file
 */
const debControl = ({ id, version, arch, product, osPackages, installedSizeKib }) => {
  const fields = [
    ['Package', `${id}-server`],
    ['Version', debVersion(version)],
    ['Architecture', arch],
    ['Maintainer', maintainerOf(product.author)],
    ['Installed-Size', String(installedSizeKib)],
    ...(osPackages.length ? [['Depends', osPackages.join(', ')]] : []),
    ['Section', DEB_SECTION],
    ['Priority', 'optional'],
    ['Description', oneLine(product.description ?? `${product.name} server`)],
  ];
  return `${fields.map(([key, value]) => `${key}: ${value}`).join('\n')}\n`;
};

export { debControl, debVersion };
