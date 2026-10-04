/* @layer tooling-scripts @kind logic */
const IDENTIFIERS = /[A-Za-z_$][\w$]*/g;

const namesIn = (list) => list.match(IDENTIFIERS) ?? [];

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @param {string} source
 * @param {string} name
 * @returns {string | null}  Where `name` is imported from, by a named import
 */
const importedFrom = (source, name) => {
  const match = new RegExp(`^import\\s*\\{[^}]*\\b${escape(name)}\\b[^}]*\\}\\s*from\\s*'([^']+)';`, 'm').exec(source);
  return match?.[1] ?? null;
};

/**
 * @param {string} source  electron/main.ts
 * @returns {{ start: number, end: number, value: string | null } | null}  bootstrapApp handlers option
 */
const handlersOption = (source) => {
  const call = source.indexOf('bootstrapApp(');
  if (call === -1) return null;
  const match = /\bhandlers\b(\s*:\s*(\[[^\]]*\]|[A-Za-z_$][\w$]*))?/.exec(source.slice(call));
  if (!match) return null;
  const start = call + match.index;
  return { start, end: start + match[0].length, value: match[2] ?? null };
};

/**
 * @param {string} source  electron/handlers/index.ts
 * @param {string} name  The exported list
 * @returns {string[] | null}  The names in the list
 */
const listedIn = (source, name) => {
  const match = new RegExp(`const\\s+${escape(name)}\\s*(?::[^=]+)?=\\s*\\[([^\\]]*)\\]`).exec(source);
  return match ? namesIn(match[1]) : null;
};

/**
 * @param {string[]} listed
 * @param {{ file: string, name: string }[]} scanned
 * @param {string} source  The file holding the imports of the listed groups
 * @param {string} folder  The import prefix of the handler files from that file
 * @returns {boolean}  The list is exactly the scanned groups
 */
const sameGroups = (listed, scanned, source, folder) =>
  listed.length === scanned.length
  && scanned.every(({ file, name }) => listed.includes(name) && importedFrom(source, name) === `${folder}${file.replace(/\.ts$/, '')}`);

export { handlersOption, importedFrom, listedIn, namesIn, sameGroups };
