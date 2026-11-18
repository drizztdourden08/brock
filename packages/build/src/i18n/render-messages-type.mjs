/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../screens/screen-conventions.constants.mjs';
import { CORE_AUGMENT, MESSAGES_TYPE_OUTPUT } from './i18n.constants.mjs';
import { messageArgs } from './message-args.mjs';
import { quoted, renderValueType } from './render-value-type.mjs';
import { scanLocales } from './scan-locales.mjs';

const LOOSE = 'Record<string, string | number>';

const argsOf = (text) => {
  try {
    return messageArgs(text);
  } catch {
    return null;
  }
};

/**
 * @param {import('./scan-locale-dir.mjs').LocaleFile[]} files the base language files
 * @returns {{ key: string, values: string, tags: string[] }[]} one row per key, in file then key order
 */
const messageRows = (files) => files.flatMap((file) => Object.entries(file.messages).map(([name, text]) => {
  const found = argsOf(text);
  return { key: `${file.namespace}:${name}`, values: found ? renderValueType(found) : LOOSE, tags: found ? [...found.tags].sort() : [] };
}));

/**
 * @param {{ key: string, values: string, tags: string[] }[]} rows
 * @returns {string} the content of .brock/messages.type.ts
 */
const renderMessagesType = (rows) => {
  const members = rows.map((row) => `    ${quoted(row.key)}: ${row.values};`);
  const tagged = rows.filter((row) => row.tags.length).map((row) => `  ${quoted(row.key)}: ${row.tags.map(quoted).join(' | ')};`);
  return [
    GENERATED_HEADER,
    `declare module '${CORE_AUGMENT}' {`,
    members.length ? ['  interface Messages {', ...members, '  }'].join('\n') : '  interface Messages {}',
    '}',
    '',
    tagged.length ? ['type AppMessageTags = {', ...tagged, '};'].join('\n') : 'type AppMessageTags = Record<never, never>;',
    '',
    'export type { AppMessageTags };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/messages.type.ts, always
 */
const renderMessagesTypeFiles = (rootDir) => {
  const { base, sources } = scanLocales(rootDir);
  const files = (sources.find((source) => source.kind === 'app')?.files ?? []).filter((file) => file.tag === base);
  return [{ path: MESSAGES_TYPE_OUTPUT, content: renderMessagesType(messageRows(files)) }];
};

export { messageRows, renderMessagesType, renderMessagesTypeFiles };
