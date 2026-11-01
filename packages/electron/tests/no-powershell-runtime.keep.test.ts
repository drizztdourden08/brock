/* @layer electron-main @kind test */
import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import { describe, expect, it } from 'vitest';

const SRC = join(__dirname, '..', 'src');
const DENY_LISTS = ['documents/autostart-path.ts', 'documents/autostart-paths.constants.ts', 'documents/opening-segments.constants.ts', 'jobs/process/process-job.constants.ts'].map((file) => join(SRC, 'main', file));

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? sourceFiles(join(dir, entry.name)) : [join(dir, entry.name)]));

describe('brock-electron runtime source', () => {
  it('never names PowerShell, apart from the deny lists that refuse it', () => {
    const named = sourceFiles(SRC).filter((file) => /powershell|pwsh/i.test(readFileSync(file, 'utf8')));
    expect(named.map((file) => relative(SRC, file).replaceAll('\\', '/')).sort()).toEqual(DENY_LISTS.map((file) => relative(SRC, file).replaceAll('\\', '/')).sort());
  });

  it('spawns nothing in the OS integration', () => {
    const files = sourceFiles(join(SRC, 'main', 'os-integration')).filter((file) => !/install-linux-integration/.test(file));
    const spawning = files.filter((file) => /child_process|spawn|execFile/.test(readFileSync(file, 'utf8')));
    expect(spawning).toEqual([]);
  });
});
