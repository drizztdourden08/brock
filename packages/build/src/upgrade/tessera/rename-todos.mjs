/* @layer tooling-scripts @kind logic */
import { NEXT_RELEASE } from './tessera-renames.constants.mjs';

const releaseLabel = (version) => (version === NEXT_RELEASE ? 'Tessera main (next)' : `Tessera ${version}`);

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const note = (version, kind, { key, value }) => `${releaseLabel(version)}: the ${kind} ${key} is now "${value}". Change it by hand.`;

const prefix = (version, kind, { key, value, full }) =>
  `${releaseLabel(version)} renamed the ${kind} ${key} to ${value}; ${full} is built from it and RENAMES.json does not list it. Check what ${full} became.`;

/**
 * @param {string} source the text the indexes point into
 * @param {string} version the release
 * @param {string} kind the name kind, such as class or custom property
 * @param {{ notes: { index: number, key: string, value: string }[], prefixes: { index: number, key: string, value: string, full: string }[] }} found
 * @returns {{ line: number, message: string }[]}
 */
const tokenTodos = (source, version, kind, { notes, prefixes }) => [
  ...notes.map((found) => ({ line: lineAt(source, found.index), message: note(version, kind, found) })),
  ...prefixes.map((found) => ({ line: lineAt(source, found.index), message: prefix(version, kind, found) })),
];

const renameTodos = Object.freeze({ tokenTodos, note, releaseLabel, lineAt });

export { renameTodos };
