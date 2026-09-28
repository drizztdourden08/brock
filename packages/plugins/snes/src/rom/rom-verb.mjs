/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { snesOptions } from '../snes-options.mjs';
import { checkRom } from './rom-sha1.mjs';

const USAGE = '  brock snes rom check <file>              SHA-1 of the file against the known list';

const check = (positional, ctx) => {
  const [file] = positional;
  if (!file) throw new Error(`No file given.\n${USAGE}`);
  const path = resolve(file);
  if (!existsSync(path)) throw new Error(`${path} does not exist.`);
  const { sha1 } = snesOptions('roms', ctx.workspace);
  const { hash, label } = checkRom(path, sha1);
  if (label) {
    ctx.log(`${basename(path)}: ${hash} (${label})`);
    return 0;
  }
  ctx.log(`${basename(path)}: ${hash} is not in the known list.`);
  return 1;
};

const run = async (positional, options, ctx) => {
  const [sub, ...rest] = positional;
  if (sub === 'check') return check(rest, ctx);
  if (sub === 'extract') throw new Error('snes rom extract is not part of this bundle: no extraction script ships with it.');
  throw new Error(`Unknown rom verb "${sub ?? ''}".\n${USAGE}`);
};

const romVerb = { usage: USAGE, run };

export { romVerb };
