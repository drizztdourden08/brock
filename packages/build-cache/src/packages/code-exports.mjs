/* @layer tooling-scripts @kind logic */
import { CODE_FILE, EXPORT_CONDITIONS } from './packages.constants.mjs';

const targetOf = (value) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  for (const condition of EXPORT_CONDITIONS) {
    const found = condition in value ? targetOf(value[condition]) : null;
    if (found) return found;
  }
  return null;
};

const exportMapOf = (pkg) => {
  const { exports } = pkg;
  if (exports === undefined) return typeof pkg.main === 'string' ? { '.': pkg.main } : null;
  if (typeof exports === 'string') return { '.': exports };
  if (!exports || typeof exports !== 'object') return null;
  const keys = Object.keys(exports);
  return keys.length > 0 && !keys[0].startsWith('.') ? { '.': exports } : exports;
};

const outNameOf = (key) => (key === '.' ? 'index' : key.slice(2).replace(/\.[cm]?js$/, ''));

/**
 * @param {Record<string, any>} pkg a package.json
 * @returns {{ key: string, file: string, out: string }[] | null} the code exports, null when not servable
 */
const codeExports = (pkg) => {
  const map = exportMapOf(pkg);
  if (!map) return null;
  const entries = [];
  for (const [key, value] of Object.entries(map)) {
    if (key.includes('*')) return null;
    const file = targetOf(value);
    if (!file || !CODE_FILE.test(file) || /\.d\.[cm]?ts$/.test(file)) continue;
    entries.push({ key, file, out: outNameOf(key) });
  }
  const outs = new Set(entries.map((entry) => entry.out));
  if (entries.length === 0 || outs.size !== entries.length || outs.has('chunks')) return null;
  return entries;
};

/**
 * @param {string} specifier an import specifier
 * @param {string} name a package name
 * @returns {string | null} the export key asked for, such as ./main
 */
const exportKeyOf = (specifier, name) => {
  if (specifier === name) return '.';
  return specifier.startsWith(`${name}/`) ? `./${specifier.slice(name.length + 1)}` : null;
};

export { codeExports, exportKeyOf };
