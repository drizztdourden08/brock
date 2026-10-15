/* @layer tooling-scripts @kind logic */

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @param {ProductInput} product
 * @param {number} [year]
 * @returns {string} product.copyright, else the year and the author
 */
const copyrightOf = (product, year = new Date().getFullYear()) => product.copyright ?? `Copyright (C) ${year} ${product.author.name}`;

/**
 * @param {ProductInput} product
 * @param {number} [year]
 * @returns {Record<string, string>} the version-info strings of the Windows executable
 */
const windowsVersionStrings = (product, year) => ({
  CompanyName: product.author.name,
  ProductName: product.name,
  FileDescription: product.name,
  LegalCopyright: copyrightOf(product, year),
  ...(product.description ? { Comments: product.description } : {}),
});

/**
 * @param {{ icoPath: string | null, versionStrings: Record<string, string>, version: string, exeName: string }} stamp
 * @returns {Record<string, unknown>} the rcedit options
 */
const rceditOptions = ({ icoPath, versionStrings, version, exeName }) => ({
  ...(icoPath ? { icon: icoPath } : {}),
  'version-string': { ...versionStrings, InternalName: exeName.replace(/\.exe$/i, ''), OriginalFilename: exeName },
  'file-version': version,
  'product-version': version,
});

export { copyrightOf, rceditOptions, windowsVersionStrings };
