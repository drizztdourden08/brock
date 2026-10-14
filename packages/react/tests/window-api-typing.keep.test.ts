/* @layer renderer-shell @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';

const SRC = resolve(import.meta.dirname, '../src');
const ROOT = resolve(import.meta.dirname, '../../..');
const BROCK_FILES = ['host/host-api.ts', 'host/expose-host-namespace.ts', 'host/require-host-api.ts', 'platform/api-shim.ts', 'log/expose-log-globals.ts'];

let dir = '';

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = '';
});

const appDeclaring = (declaration: string): string => {
  dir = mkdtempSync(join(tmpdir(), 'brock-window-api-'));
  const file = join(dir, 'app-globals.ts');
  const imports = BROCK_FILES.map((path, at) => `import * as brock${at} from '${join(SRC, path).replaceAll('\\', '/')}';`);
  writeFileSync(file, [...imports, `declare global {\n  ${declaration}\n}`, `export const used = [${BROCK_FILES.map((_, at) => `brock${at}`).join(', ')}];`, ''].join('\n'));
  return file;
};

const errorsOf = (file: string): string[] => {
  const program = ts.createProgram([file], {
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, target: ts.ScriptTarget.ES2022, lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
    strict: true, noEmit: true, skipLibCheck: true, types: ['node', 'vite/client'], typeRoots: [join(ROOT, 'node_modules/@types')], allowImportingTsExtensions: true,
  });
  return ts.getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.file?.fileName.includes('/packages/react/src/') === true)
    .map((diagnostic) => `${diagnostic.file?.fileName ?? ''}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
};

describe('the window.api typing', () => {
  it('leaves an app free to declare its own window.api', () => {
    expect(errorsOf(appDeclaring('interface Window { api: { appOnly: () => void } }'))).toEqual([]);
  }, 60_000);

  it('leaves an app free to declare an optional window.api and the log globals', () => {
    expect(errorsOf(appDeclaring('interface Window { api?: { appOnly: () => void }; __logEntries?: string }'))).toEqual([]);
  }, 60_000);
});
