/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const COMPONENT_OPTIONAL = ['{Name}.css', '{Name}.type.ts', '{Name}.constants.ts', 'behavior', 'sub-components'];
const BEHAVIOR_FILE = /^(?:use[A-Z]\w*|[a-z][a-z0-9-]*)(?:\.type|\.constants)?\.ts$/;
const SUB_COMPONENT_FILE = /^[A-Z]\w*(?:\.tsx|\.type\.ts|\.constants\.ts|\.css)$/;
const MODULE_FILE = /^(?:[a-z][a-z0-9-]*(?:\.type|\.constants|\.task)?\.ts|use[A-Z]\w*\.ts|[A-Z]\w*(?:\.tsx|\.type\.ts|\.constants\.ts|\.css)|index\.ts|augment\.ts|main\.tsx|[a-z][a-z0-9-]*\.(?:html|css))$/;
const SKIP = new Set(['node_modules', 'dist', 'out', 'release', 'coverage', '.brock', 'stories', 'tests']);

const entriesOf = (dir) => readdirSync(dir).filter((name) => !SKIP.has(name));
const isDir = (path) => statSync(path).isDirectory();
const isComponentFolder = (dir) => existsSync(join(dir, `${basename(dir)}.tsx`));

const checkBehavior = (dir, label) =>
  entriesOf(dir).filter((name) => !BEHAVIOR_FILE.test(name)).map((name) => `${label}/behavior/${name}: a behavior file is useThing.ts or a kebab-case pure function`);

const checkSubComponents = (dir, label) => {
  const findings = [];
  for (const name of entriesOf(dir)) {
    const path = join(dir, name);
    if (isDir(path)) findings.push(...(isComponentFolder(path) ? checkComponentFolder(path, `${label}/sub-components/${name}`) : [`${label}/sub-components/${name}: a folder here is a component folder (${name}/${name}.tsx)`]));
    else if (!SUB_COMPONENT_FILE.test(name)) findings.push(`${label}/sub-components/${name}: a flat sub-component is Name.tsx with Name.type.ts, Name.constants.ts or Name.css beside it; behavior/ or sub-components/ of its own make it a folder`);
  }
  return findings;
};

const checkComponentFolder = (dir, label) => {
  const name = basename(dir);
  const allowed = new Set([`${name}.tsx`, 'index.ts', ...COMPONENT_OPTIONAL.map((f) => f.replace('{Name}', name))]);
  const entries = entriesOf(dir);
  const findings = entries.filter((e) => !allowed.has(e)).map((e) => `${label}/${e}: not part of a component folder (${name}.tsx, index.ts, ${name}.css, ${name}.type.ts, ${name}.constants.ts, behavior/, sub-components/)`);
  if (!entries.includes('index.ts')) findings.push(`${label}: missing index.ts`);
  if (entries.includes('behavior')) findings.push(...checkBehavior(join(dir, 'behavior'), label));
  if (entries.includes('sub-components')) findings.push(...checkSubComponents(join(dir, 'sub-components'), label));
  return findings;
};

const checkModuleFolder = (dir, label) =>
  entriesOf(dir).filter((name) => !isDir(join(dir, name)) && !MODULE_FILE.test(name)).map((name) => `${label}/${name}: a module file is kebab-case.ts, <subject>.type.ts, <subject>.constants.ts, <id>.task.ts or index.ts`);

const walk = (rootDir, dir, findings, skip) => {
  if (skip.has(dir)) return;
  const label = relative(rootDir, dir).replace(/\\/g, '/');
  if (isComponentFolder(dir)) { findings.push(...checkComponentFolder(dir, label)); return; }
  findings.push(...checkModuleFolder(dir, label));
  for (const name of entriesOf(dir)) {
    const path = join(dir, name);
    if (isDir(path)) walk(rootDir, path, findings, skip);
  }
};

/**
 * @param {string} rootDir
 * @param {string} srcDir
 * @param {string[]} [skipDirs] folders another check owns
 * @returns {string[]}
 */
const checkShapes = (rootDir, srcDir, skipDirs = []) => {
  const findings = [];
  if (existsSync(srcDir)) walk(rootDir, srcDir, findings, new Set(skipDirs));
  return findings;
};

export { checkShapes };
