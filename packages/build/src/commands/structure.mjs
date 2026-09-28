/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { scopeOf } from './adopt.mjs';
import { checkShapes } from './structure-shape.mjs';

const GENERIC_FOLDERS = new Set(['lib', 'utils', 'helpers', 'misc', 'common']);
const DEFAULT_GLOBS = ['apps/*', 'packages/*', 'tooling/*'];
const MAX_DEPTH_BELOW_SRC = 5;
const SKIP = new Set(['node_modules', 'dist', 'out', 'release', 'coverage', '.brock']);
const APP_MARKER = 'brock.config.ts';

const workspaceGlobs = (rootDir) => {
  const file = join(rootDir, 'pnpm-workspace.yaml');
  if (!existsSync(file)) return { globs: DEFAULT_GLOBS, declared: false };
  const globs = [];
  let inPackages = false;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trimEnd();
    const inline = line.match(/^packages:\s*\[(.*)\]\s*$/);
    if (inline) {
      globs.push(...inline[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean));
      return { globs, declared: true };
    }
    if (/^packages:\s*$/.test(line)) { inPackages = true; continue; }
    if (inPackages && /^\s+-\s+/.test(line)) { globs.push(line.replace(/^\s+-\s+/, '').replace(/^['"]|['"]$/g, '')); continue; }
    if (inPackages && /^\S/.test(line)) inPackages = false;
  }
  return { globs, declared: true };
};

const globBase = (glob) => glob.split('/*')[0];

const expandGlob = (rootDir, glob, bases) => {
  const [base, tail] = glob.split('/*');
  if (tail === undefined) return existsSync(join(rootDir, glob)) ? [join(rootDir, glob)] : [];
  const dir = join(rootDir, base);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((n) => !bases.has(`${base}/${n}`))
    .map((n) => join(dir, n))
    .filter((p) => statSync(p).isDirectory());
};

const walk = (dir, visit, depth = 0) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    visit(full, entry.name, depth + 1);
    walk(full, visit, depth + 1);
  }
};

const checkSrc = (rootDir, dir, findings) => {
  const src = join(dir, 'src');
  if (!existsSync(src)) return;
  walk(src, (full, name, depth) => {
    const at = relative(rootDir, full).replace(/\\/g, '/');
    if (GENERIC_FOLDERS.has(name)) findings.push(`${at}: folder "${name}" names a layer, not a subject`);
    if (depth > MAX_DEPTH_BELOW_SRC) findings.push(`${at}: deeper than ${MAX_DEPTH_BELOW_SRC} levels below src`);
  });
  if (existsSync(join(src, 'index.ts')) || existsSync(join(src, 'main.tsx'))) findings.push(...checkShapes(rootDir, src));
};

const hasBarrel = (dir, pkg) => {
  const exportsField = pkg.exports;
  if (!exportsField) return { ok: false, reason: 'no exports; a package has one public barrel' };
  const entries = typeof exportsField === 'string' ? { '.': exportsField } : exportsField;
  const targets = Object.values(entries).map((e) => (typeof e === 'string' ? e : e?.default ?? e?.import));
  if (!targets.length) return { ok: false, reason: 'exports is empty' };
  const missing = targets.filter((t) => typeof t === 'string' && !t.includes('*') && !existsSync(join(dir, t)));
  return missing.length ? { ok: false, reason: `exports points at ${missing[0]}, which does not exist` } : { ok: true };
};

const isAppDir = (dir, label) => label.startsWith('apps/') || label.startsWith('templates/') || existsSync(join(dir, APP_MARKER));

const packageProblems = (dir, label, pkg, scope) => {
  const problems = [];
  if (!pkg.name || !pkg.name.startsWith(`${scope}/`)) problems.push(`${label}: name "${pkg.name ?? ''}" is not "${scope}/<subject>"`);
  if (!pkg.bin) {
    const barrel = hasBarrel(dir, pkg);
    if (!barrel.ok) problems.push(`${label}: ${barrel.reason}`);
  }
  return problems;
};

const checkPackage = (rootDir, dir, scope, findings) => {
  const label = relative(rootDir, dir).replace(/\\/g, '/') || '.';
  const pkgFile = join(dir, 'package.json');
  if (!existsSync(pkgFile)) { findings.push(`${label}: no package.json; every workspace folder is a package`); return; }
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  if (!isAppDir(dir, label)) findings.push(...packageProblems(dir, label, pkg, scope));
  checkSrc(rootDir, dir, findings);
};

const scopeFromFile = (rootDir) => {
  const scopeFile = join(rootDir, 'brock.scope');
  return existsSync(scopeFile) ? readFileSync(scopeFile, 'utf8').trim() : undefined;
};

const resolveScope = (rootDir, explicitScope) => {
  const pkgFile = join(rootDir, 'package.json');
  const pkg = existsSync(pkgFile) ? JSON.parse(readFileSync(pkgFile, 'utf8')) : {};
  return scopeOf(pkg, explicitScope ?? scopeFromFile(rootDir));
};

const rootKind = (rootDir, dirs) => {
  if (existsSync(join(rootDir, APP_MARKER))) return 'app';
  if (!dirs.length && existsSync(join(rootDir, 'src'))) return 'package';
  return null;
};

/**
 * @param {string} rootDir
 * @param {string} scope
 * @returns {{ findings: string[], counted: number }}
 */
const collectFindings = (rootDir, scope) => {
  const findings = [];
  const { globs, declared } = workspaceGlobs(rootDir);
  const bases = new Set(globs.map(globBase).filter((b) => b.includes('/')));
  const dirs = globs.flatMap((g) => expandGlob(rootDir, g, bases));
  const kind = rootKind(rootDir, dirs);
  if (kind === 'app') checkSrc(rootDir, rootDir, findings);
  else if (kind === 'package') checkPackage(rootDir, rootDir, scope, findings);
  else if (!dirs.length && !declared) findings.push('no workspace folders found (apps/*, packages/*, tooling/* or pnpm-workspace.yaml)');
  for (const dir of dirs) checkPackage(rootDir, dir, scope, findings);
  return { findings, counted: dirs.length + (kind ? 1 : 0) };
};

/**
 * @param {{ rootDir: string, scope?: string}} ctx
 * @returns {Promise<number>} exit code
 */
const runStructure = async ({ rootDir, scope: explicitScope }) => {
  const scope = resolveScope(rootDir, explicitScope);
  const { findings, counted } = collectFindings(rootDir, scope);
  if (!findings.length) {
    console.log(`brock structure: ${counted} package(s) under ${scope}, no findings.`);
    return 0;
  }
  console.error(`brock structure: ${findings.length} finding(s) under ${scope}:`);
  for (const f of findings) console.error(`  ${f}`);
  return 1;
};

export { runStructure, workspaceGlobs, globBase, expandGlob };
