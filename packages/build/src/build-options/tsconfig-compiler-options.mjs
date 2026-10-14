/* @layer tooling-scripts @kind logic */

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const isFlat = (list) => list.every((entry) => !isObject(entry) && !Array.isArray(entry));

/**
 * @param {unknown} value
 * @param {string} indent
 * @returns {string} JSON as the managed tsconfig.json is written
 */
const formatJson = (value, indent = '') => {
  if (Array.isArray(value) && isFlat(value)) return `[${value.map((entry) => JSON.stringify(entry)).join(', ')}]`;
  const inner = `${indent}  `;
  if (Array.isArray(value)) return value.length ? `[\n${value.map((entry) => `${inner}${formatJson(entry, inner)}`).join(',\n')}\n${indent}]` : '[]';
  if (!isObject(value)) return JSON.stringify(value);
  const entries = Object.entries(value);
  if (!entries.length) return '{}';
  return `{\n${entries.map(([key, entry]) => `${inner}${JSON.stringify(key)}: ${formatJson(entry, inner)}`).join(',\n')}\n${indent}}`;
};

/**
 * @param {Record<string, unknown>} managed the managed compilerOptions
 * @param {Record<string, unknown>} own the app's
 * @returns {Record<string, unknown>} key by key, the app's last; paths entry by entry
 */
const mergeCompilerOptions = (managed, own) => ({
  ...managed,
  ...own,
  ...(isObject(managed.paths) && isObject(own.paths) ? { paths: { ...managed.paths, ...own.paths } } : {}),
});

/**
 * @param {unknown} compilerOptions tsconfig.compilerOptions of brock.config.ts or brock.site.ts
 * @param {string} file the config file, for the message
 * @returns {Record<string, unknown> | null} null when there is nothing to merge
 */
const ownCompilerOptions = (compilerOptions, file) => {
  if (compilerOptions === undefined || compilerOptions === null) return null;
  if (!isObject(compilerOptions)) throw new Error(`${file} tsconfig.compilerOptions must be an object of TypeScript compiler options.`);
  return Object.keys(compilerOptions).length ? compilerOptions : null;
};

/**
 * @param {string} text the managed tsconfig.json
 * @param {unknown} compilerOptions the app's, from brock.config.ts
 * @returns {string} the file with the app's options merged in
 */
const withCompilerOptions = (text, compilerOptions) => {
  const own = ownCompilerOptions(compilerOptions, 'brock.config.ts');
  if (!own) return text;
  const tsconfig = JSON.parse(text);
  return `${formatJson({ ...tsconfig, compilerOptions: mergeCompilerOptions(tsconfig.compilerOptions ?? {}, own) })}\n`;
};

export { formatJson, mergeCompilerOptions, ownCompilerOptions, withCompilerOptions };
