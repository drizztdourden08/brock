/* @layer tooling-scripts @kind logic */
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { FILETYPE_SIZES, FILETYPES_BUILD_DIR, FILETYPES_DIR } from './brand-files.mjs';

/**
 * @typedef {{ ext: string, name: string, icon?: string }} AssociationInput
 */

const slug = (text) => text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * @param {AssociationInput} association
 * @returns {string[]} candidate folder names, best first
 */
const folderNames = ({ ext, name }) => [...new Set([ext.toLowerCase(), name.toLowerCase(), slug(name)].filter(Boolean))];

/**
 * @param {string} ext
 * @returns {string} the icon name under build/
 */
const fileTypeIconName = (ext) => `filetypes/${ext.toLowerCase()}`;

const isFolder = (dir) => existsSync(dir) && statSync(dir).isDirectory();

/**
 * @param {string} brandDir
 * @param {AssociationInput} association
 * @returns {string | null} the brand folder of the type, if any
 */
const brandFolderOf = (brandDir, association) => folderNames(association).find((folder) => isFolder(join(brandDir, FILETYPES_DIR, folder))) ?? null;

const filesOf = (ext, folder) => {
  const source = `${FILETYPES_DIR}/${folder}`;
  return [
    { from: `${source}/icon.ico`, to: `${FILETYPES_BUILD_DIR}/${ext}.ico` },
    { from: `${source}/icon.icns`, to: `${FILETYPES_BUILD_DIR}/${ext}.icns` },
    ...FILETYPE_SIZES.map((size) => ({ from: `${source}/png/icon-${size}.png`, to: `${FILETYPES_BUILD_DIR}/linux/${ext}/${size}x${size}.png` })),
  ];
};

/**
 * @param {string} brandDir The brand folder inside Tessera
 * @param {AssociationInput[]} associations product.fileAssociations
 * @returns {import('./brand-files.mjs').BrandFile[]} ico, icns and Linux sizes per type
 */
const filetypeFiles = (brandDir, associations = []) => {
  const seen = new Set();
  return associations.flatMap((association) => {
    const ext = association.ext.toLowerCase();
    const folder = brandFolderOf(brandDir, association);
    if (!folder || seen.has(ext)) return [];
    seen.add(ext);
    return filesOf(ext, folder);
  });
};

/**
 * @param {string} rootDir The app root
 * @param {string | undefined} brand icons.brand
 * @param {AssociationInput[]} associations
 * @returns {AssociationInput[]} types without an icon take the generated one
 */
const withFiletypeIcons = (rootDir, brand, associations = []) =>
  associations.map((association) => {
    if (association.icon || !brand) return association;
    const generated = join(rootDir, FILETYPES_BUILD_DIR, `${association.ext.toLowerCase()}.ico`);
    return existsSync(generated) ? { ...association, icon: fileTypeIconName(association.ext) } : association;
  });

export { filetypeFiles, withFiletypeIcons };
