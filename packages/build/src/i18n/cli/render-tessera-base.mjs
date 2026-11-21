/* @layer tooling-scripts @kind logic */
import { ARG_OPEN, ARG_OPEN_ALT } from './cli.constants.mjs';

const escapeIcu = (text) => text.replace(/[{}]/g, "'$&'");

const filled = (names, open) => names.map((name) => `${open}${name}${open}`);

const placeholders = (text, open) => escapeIcu(text).replaceAll(new RegExp(`${open}([^${open}]+)${open}`, 'g'), '{$1}');

const functionMessage = (fn, names) => {
  const list = names.length ? names : Array.from({ length: fn.length }, (_, index) => `arg${index}`);
  const first = placeholders(String(fn(...filled(list, ARG_OPEN))), ARG_OPEN);
  const second = placeholders(String(fn(...filled(list, ARG_OPEN_ALT))), ARG_OPEN_ALT);
  return { text: first, varies: first !== second, guessed: !names.length && list.length > 0 };
};

const entryOf = (group, key, value, names) => {
  if (typeof value === 'string') return { text: escapeIcu(value) };
  if (typeof value !== 'function') return { skipped: `${group}.${key} is not a string or a function` };
  try {
    return functionMessage(value, names);
  } catch (error) {
    return { skipped: `${group}.${key} threw (${error instanceof Error ? error.message : String(error)}); write its ICU message by hand` };
  }
};

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const addRecord = (messages, notes, group, key, record) => {
  for (const [sub, value] of Object.entries(record)) {
    if (typeof value === 'string') messages[`${group}.${key}.${sub}`] = escapeIcu(value);
    else notes.push(`${group}.${key}.${sub} is not a string`);
  }
};

/**
 * @param {{ strings: Record<string, Record<string, unknown>>, params: Record<string, Record<string, string[]>> }} source the loaded Tessera strings
 * @returns {{ messages: Record<string, string>, notes: string[] }} the flat English base and what needs a hand-written message
 */
const renderTesseraBase = ({ strings, params }) => {
  const messages = {};
  const notes = [];
  for (const [group, entries] of Object.entries(strings)) {
    for (const [key, value] of Object.entries(entries ?? {})) {
      if (isRecord(value)) {
        addRecord(messages, notes, group, key, value);
        continue;
      }
      const entry = entryOf(group, key, value, params[group]?.[key] ?? []);
      if (entry.skipped) notes.push(entry.skipped);
      else messages[`${group}.${key}`] = entry.text;
      if (entry.varies) notes.push(`${group}.${key} changes with its input; write its ICU message by hand`);
      if (entry.guessed) notes.push(`${group}.${key} has no TESSERA_STRING_PARAMS entry; its params are arg0, arg1, ...`);
    }
  }
  return { messages, notes };
};

export { renderTesseraBase };
