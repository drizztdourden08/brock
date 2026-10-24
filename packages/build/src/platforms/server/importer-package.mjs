/* @layer tooling-scripts @kind logic */
const MODULES = '/node_modules/';

/**
 * @param {string | undefined} importer the importing file, as the bundler reports it
 * @returns {string | null} the owning npm package, or null
 */
const importerPackage = (importer) => {
  if (!importer) return null;
  const path = importer.replace(/[?#].*$/, '').replaceAll('\\', '/');
  const at = path.lastIndexOf(MODULES);
  if (at < 0) return null;
  const parts = path.slice(at + MODULES.length).split('/');
  return parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
};

export { importerPackage };
