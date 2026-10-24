/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DEFAULT_TARGETS } from '../platforms.constants.mjs';
import { addJsonListEntries } from '../scaffold/add-json-list-entries.mjs';
import { shapeOf } from './app-shape.mjs';
import {
  SERVER_DIR, SERVER_ENTRY, STARTER_EMBED_FILE, STARTER_FILES, STARTER_FOLDER, STARTER_KNIP_ENTRY, STARTER_KNIP_PROJECT,
} from './server.constants.mjs';

const writeStarter = (rootDir, files) => {
  for (const { from, to } of files) {
    const target = join(rootDir, to);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, readFileSync(join(SERVER_DIR, STARTER_FOLDER, from), 'utf8').replace(/\r\n/g, '\n'), 'utf8');
  }
};

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} server/main.ts, server/start.ts and the embedding task
 */
const serverStarter = () => ({
  name: 'server starter files',
  phase: 'files',
  run: (ctx) => {
    if (ctx.config.server?.entry !== undefined) return { status: 'skipped', detail: 'server.entry is set; write that file yourself' };
    if (existsSync(join(ctx.rootDir, SERVER_ENTRY))) return { status: 'skipped', detail: `${SERVER_ENTRY} exists` };
    const { windowless } = shapeOf(ctx.config.targets ?? DEFAULT_TARGETS);
    const files = windowless ? STARTER_FILES : [...STARTER_FILES, STARTER_EMBED_FILE];
    writeStarter(ctx.rootDir, files);
    const knip = join(ctx.rootDir, 'knip.json');
    addJsonListEntries(knip, 'entry', [STARTER_KNIP_ENTRY]);
    addJsonListEntries(knip, 'project', [STARTER_KNIP_PROJECT]);
    return { status: 'done', detail: files.map((file) => file.to).join(', ') };
  },
});

export { serverStarter };
