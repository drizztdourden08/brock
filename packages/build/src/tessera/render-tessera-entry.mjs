/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../screens/screen-conventions.constants.mjs';
import { TESSERA_PACKAGE } from '../upgrade/tessera/tessera-renames.constants.mjs';
import { hasTessera } from './has-tessera.mjs';
import { TESSERA_ENTRY_OUTPUT } from './tessera.constants.mjs';

const renderTesseraEntry = () => [GENERATED_HEADER, `import type {} from '${TESSERA_PACKAGE}';`, ''].join('\n');

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string | null }[]} null content removes it
 */
const renderTesseraEntryFiles = (rootDir) => [{ path: TESSERA_ENTRY_OUTPUT, content: hasTessera(rootDir) ? renderTesseraEntry() : null }];

export { renderTesseraEntry, renderTesseraEntryFiles };
