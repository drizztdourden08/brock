/* @layer tooling-scripts @kind types */
interface MigrationEntry {
  version: string;
  file: string;
  source: string;
  summary: string | null;
}

interface MigrationTodo {
  number: number;
  migration: string;
  file: string;
  line: number | null;
  message: string;
}

interface MigrationRun {
  applied: { id: string; version: string; source: string; summary: string; touched: string[] }[];
  todos: MigrationTodo[];
}

interface WorkspaceStepResult {
  /** Files written or moved, relative to rootDir. */
  touched?: string[];
  /** Folders or files moved, relative to rootDir; to-dos of earlier migrations follow them. */
  moved?: { from: string; to: string }[];
  todos?: { file: string; line?: number | null; message: string }[];
}

interface ModuleWithMigrations {
  packageName: string;
  dir: string;
  manifest: { migrations?: { version: string; entry: string; summary: string }[] };
}

interface PatternRule {
  pattern: RegExp;
  message: string;
  near?: RegExp;
}

interface ImportMove {
  from: string;
  to: string;
  names: ReadonlySet<string>;
}

interface JsxProp {
  name: string;
  start: number;
  end: number;
  line: number;
  literal: string | null;
}

declare const collectMigrations: (modules: ModuleWithMigrations[], ownDir?: string) => MigrationEntry[];
declare const selectMigrations: <T extends { version: string; source: string; file: string }>(migrations: T[], range: { from: string; to: string | null }) => T[];
declare const runMigrations: (rootDir: string, migrations: MigrationEntry[]) => Promise<MigrationRun>;
declare const pinApp: (rootDir: string, version: string, check: boolean) => string[];
declare const findJsxProps: (source: string, element: string, names: string[]) => JsxProp[];
declare const removeSpans: (source: string, spans: { start: number; end: number }[]) => string;
declare const designPackageStep: (ctx: { rootDir: string }) => WorkspaceStepResult;
declare const patternTodos: (source: string, rules: PatternRule[]) => { line: number; message: string }[];
declare const importMoves: (spec: { moves: readonly ImportMove[]; noTypescript: string }) => (file: { path: string; source: string }) => { source: string; todos: { line: number; message: string }[] };

export { collectMigrations, designPackageStep, findJsxProps, importMoves, patternTodos, pinApp, removeSpans, runMigrations, selectMigrations };
export type { ImportMove, JsxProp, MigrationEntry, PatternRule, MigrationRun, MigrationTodo, ModuleWithMigrations, WorkspaceStepResult };
