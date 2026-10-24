/* @layer tooling-scripts @kind logic */
import { DEB_MAINTAINER_FALLBACK, DEB_SECTION } from './server-packaging.constants.mjs';

const oneLine = (text) => String(text).replace(/\s+/g, ' ').trim();

/**
 * @param {string} version an npm version
 * @returns {string} a Debian version, a prerelease sorting first
 */
const debVersion = (version) => version.replace('-', '~').replace(/\+/g, '.');

/**
 * @param {{ id: string, version: string, arch: string, product: { name: string, description?: string, author: { name: string, email?: string } }, osPackages: string[], installedSizeKib: number }} spec
 * @returns {string} the DEBIAN/control file
 */
const debControl = ({ id, version, arch, product, osPackages, installedSizeKib }) => {
  const fields = [
    ['Package', `${id}-server`],
    ['Version', debVersion(version)],
    ['Architecture', arch],
    ['Maintainer', `${oneLine(product.author.name)} <${product.author.email ?? DEB_MAINTAINER_FALLBACK}>`],
    ['Installed-Size', String(installedSizeKib)],
    ...(osPackages.length ? [['Depends', osPackages.join(', ')]] : []),
    ['Section', DEB_SECTION],
    ['Priority', 'optional'],
    ['Description', oneLine(product.description ?? `${product.name} server`)],
  ];
  return `${fields.map(([key, value]) => `${key}: ${value}`).join('\n')}\n`;
};

export { debControl, debVersion };
