/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {{ tag: string, namespace: string, path: string, messages: Record<string, string> }} LocaleFile
 */

const readJson = (file) => {
  try {
    const value = JSON.parse(readFileSync(file, 'utf8'));
    return value && typeof value === 'object' && !Array.isArray(value) ? { value } : { problem: 'is not a JSON object of keys to strings' };
  } catch (error) {
    return { problem: `is not valid JSON (${error instanceof Error ? error.message : String(error)})` };
  }
};

const readNamespace = (root, label, tag, entry) => {
  const path = `${label}/${tag}/${entry.name}`;
  if (!entry.isFile() || !entry.name.endsWith('.json')) return { finding: `${path}: not a namespace file; ${tag} holds <namespace>.json files only` };
  const read = readJson(join(root, tag, entry.name));
  if (read.problem) return { finding: `${path}: ${read.problem}` };
  const bad = Object.entries(read.value).find(([, text]) => typeof text !== 'string');
  if (bad) return { finding: `${path}: "${bad[0]}" is not a string; a value is an ICU message text` };
  return { file: { tag, namespace: entry.name.slice(0, -'.json'.length), path, messages: read.value } };
};

const readTag = (root, label, folder) => {
  if (!folder.isDirectory()) return [{ finding: `${label}/${folder.name}: not a language folder; ${label} holds one folder per language tag` }];
  const entries = readdirSync(join(root, folder.name), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  return entries.map((entry) => readNamespace(root, label, folder.name, entry));
};

/**
 * @param {string} root an absolute locales folder
 * @param {string} label the folder as findings and imports show it
 * @returns {{ files: LocaleFile[], findings: string[] }} every namespace file by tag then namespace, and what does not fit
 */
const scanLocaleDir = (root, label) => {
  if (!existsSync(root)) return { files: [], findings: [] };
  const folders = readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const read = folders.flatMap((folder) => readTag(root, label, folder));
  return { files: read.flatMap(({ file }) => (file ? [file] : [])), findings: read.flatMap(({ finding }) => (finding ? [finding] : [])) };
};

export { scanLocaleDir };
