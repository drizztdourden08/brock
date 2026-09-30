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

interface ModuleWithMigrations {
  packageName: string;
  dir: string;
  manifest: { migrations?: { version: string; entry: string; summary: string }[] };
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

export { collectMigrations, findJsxProps, pinApp, removeSpans, runMigrations, selectMigrations };
export type { JsxProp, MigrationEntry, MigrationRun, MigrationTodo, ModuleWithMigrations };
