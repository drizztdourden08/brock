/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const USAGE = '  brock release                gh release create v<version> from release-notes/v<version>.md (asks)';

const rootVersion = (rootDir) => {
  const file = join(rootDir, 'package.json');
  if (!existsSync(file)) throw new Error(`${file} is missing; the release version is read from the root package.json.`);
  const version = JSON.parse(readFileSync(file, 'utf8')).version;
  if (typeof version !== 'string' || !version) throw new Error(`${file} has no "version".`);
  return version;
};

const run = async (positional, options, ctx) => {
  const tag = `v${rootVersion(ctx.rootDir)}`;
  const notesRel = join('release-notes', `${tag}.md`);
  const notes = join(ctx.rootDir, notesRel);
  if (!existsSync(notes)) throw new Error(`${notesRel} is missing. Write the notes for ${tag} first; that file is the release body.`);
  ctx.log(`gh release create ${tag} --notes-file ${notesRel} --title ${tag}`);
  execFileSync('gh', ['release', 'create', tag, '--notes-file', notes, '--title', tag], { cwd: ctx.rootDir, stdio: 'inherit' });
  ctx.log(`Release ${tag} created.`);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const releaseVerb = { usage: USAGE, run, asks: true };

export { releaseVerb };
