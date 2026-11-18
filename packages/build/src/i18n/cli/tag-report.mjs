/* @layer tooling-scripts @kind logic */
import { MISSING_LISTED } from './cli.constants.mjs';
import { messageProblems } from './message-problems.mjs';

const fileErrors = (file, baseFile, isBase) => Object.entries(file.messages).flatMap(([key, text]) => {
  if (baseFile && !isBase && !(key in baseFile.messages)) return [`${file.path}: "${key}" is not in the base file; the base has every key`];
  const baseText = isBase ? undefined : baseFile?.messages[key];
  return messageProblems(baseText, text).map((problem) => `${file.path}: "${key}" ${problem}`);
});

const missingLine = (tag, namespace, baseFile, own) => {
  const keys = Object.keys(baseFile.messages);
  const missing = keys.filter((key) => !own || !(key in own.messages));
  if (!missing.length) return [];
  const more = missing.length > MISSING_LISTED ? ', ...' : '';
  return [`${tag}/${namespace}: ${missing.length} of ${keys.length} keys missing (${missing.slice(0, MISSING_LISTED).join(', ')}${more})`];
};

/**
 * @param {{ files: import('../scan-locale-dir.mjs').LocaleFile[], baseFiles: Map<string, import('../scan-locale-dir.mjs').LocaleFile>, base: string, tag: string }} input one tag
 * @returns {{ errors: string[], warnings: string[] }} errors of the tag's files, warnings for missing keys
 */
const tagReport = ({ files, baseFiles, base, tag }) => {
  const own = new Map(files.filter((file) => file.tag === tag).map((file) => [file.namespace, file]));
  const isBase = tag === base;
  const errors = [...own.values()].flatMap((file) => fileErrors(file, baseFiles.get(file.namespace), isBase));
  const warnings = isBase ? [] : [...baseFiles].flatMap(([namespace, baseFile]) => missingLine(tag, namespace, baseFile, own.get(namespace)));
  return { errors, warnings };
};

export { tagReport };
