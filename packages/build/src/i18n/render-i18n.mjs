/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALES_CHUNK_DIR, LOCALES_MAIN_OUTPUT, LOCALES_OUTPUT } from './i18n.constants.mjs';
import { renderLocaleChunk } from './render-locale-chunk.mjs';
import { renderLocales } from './render-locales.mjs';
import { renderLocalesMain } from './render-locales-main.mjs';
import { renderMessagesTypeFiles } from './render-messages-type.mjs';
import { scanLocales } from './scan-locales.mjs';

const chunkPath = (tag) => `${LOCALES_CHUNK_DIR}/${tag}.ts`;

const staleChunks = (rootDir, wanted) => {
  const dir = join(rootDir, LOCALES_CHUNK_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).map((name) => `${LOCALES_CHUNK_DIR}/${name}`).filter((path) => !wanted.includes(path)).map((path) => ({ path, content: null }));
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string | null }[]} the four locale outputs, always, and null for a chunk of a language that is gone
 */
const renderI18nFiles = (rootDir) => {
  const scan = scanLocales(rootDir);
  const chunks = scan.offered.filter((tag) => tag !== scan.base).map((tag) => ({ path: chunkPath(tag), content: renderLocaleChunk(scan.sources, tag) }));
  return [
    { path: LOCALES_OUTPUT, content: renderLocales(scan) },
    ...chunks,
    ...staleChunks(rootDir, chunks.map((chunk) => chunk.path)),
    { path: LOCALES_MAIN_OUTPUT, content: renderLocalesMain(scan) },
    ...renderMessagesTypeFiles(rootDir),
  ];
};

export { renderI18nFiles };
