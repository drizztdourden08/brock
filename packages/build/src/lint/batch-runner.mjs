/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { STATS_ENV } from './lint.constants.mjs';

const [node, , eslintBin, listFile, ...rest] = process.argv;
const files = JSON.parse(readFileSync(listFile, 'utf8'));

if (process.env[STATS_ENV]) {
  process.on('exit', () => {
    const peak = Math.round(process.resourceUsage().maxRSS / 1024);
    console.error(`brock lint: batch of ${files.length} files, peak memory ${peak} MB`);
  });
}

process.argv = [node, eslintBin, ...files, ...rest];
await import(pathToFileURL(eslintBin).href);
