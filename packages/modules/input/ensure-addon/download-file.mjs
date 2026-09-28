/* @layer tooling-scripts @kind logic */
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * @param {string} url
 * @param {string} destination
 * @returns {Promise<void>}
 */
const downloadFile = async (url, destination) => {
  mkdirSync(dirname(destination), { recursive: true });
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
};

export { downloadFile };
