/* @layer tooling-scripts @kind logic */
import { messageArgs } from '../message-args.mjs';

const parsed = (text) => {
  try {
    return { args: messageArgs(text) };
  } catch (error) {
    return { problem: `does not parse as an ICU message (${error instanceof Error ? error.message : String(error)})` };
  }
};

const argProblems = (base, own) => [
  ...[...base.args].flatMap(([name, use]) => {
    const got = own.args.get(name);
    if (!got) return [`is missing the argument {${name}} of the base`];
    return got.kind === use.kind ? [] : [`uses {${name}} as ${got.kind}, the base uses it as ${use.kind}`];
  }),
  ...[...own.args.keys()].filter((name) => !base.args.has(name)).map((name) => `uses {${name}}, which the base does not have`),
];

const tagProblems = (base, own) => [
  ...[...base.tags].filter((name) => !own.tags.has(name)).map((name) => `is missing the tag <${name}> of the base`),
  ...[...own.tags].filter((name) => !base.tags.has(name)).map((name) => `uses <${name}>, which the base does not have`),
];

/**
 * @param {string | undefined} baseText the base message, none for the base itself
 * @param {string} text the message to check
 * @returns {string[]} what is wrong with the message
 */
const messageProblems = (baseText, text) => {
  const own = parsed(text);
  if (own.problem) return [own.problem];
  const base = baseText === undefined ? null : parsed(baseText);
  if (!base || base.problem) return [];
  return [...argProblems(base.args, own.args), ...tagProblems(base.args, own.args)];
};

export { messageProblems };
