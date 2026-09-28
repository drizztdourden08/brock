/* @layer tooling-scripts @kind logic */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

/**
 * @type {{ key: keyof import('./identity.mjs').Identity, label: string } []}
 */
const QUESTIONS = [
  { key: 'name', label: 'App name' },
  { key: 'id', label: 'Package id (slug)' },
  { key: 'appId', label: 'App id (reverse-DNS)' },
  { key: 'authorName', label: 'Author name' },
  { key: 'authorEmail', label: 'Author email (optional)' },
];

/**
 * @param {import('./identity.mjs').Identity} identity
 * @param {Set<string>} missing Keys no flag supplied
 * @returns {Promise<import('./identity.mjs').Identity>}
 */
const promptIdentity = async (identity, missing) => {
  const asked = QUESTIONS.filter((q) => missing.has(q.key));
  if (!asked.length || !stdin.isTTY) return identity;
  const rl = createInterface({ input: stdin, output: stdout });
  const next = { ...identity };
  try {
    for (const { key, label } of asked) {
      const current = next[key];
      const suffix = current ? ` (${current})` : '';
      const answer = (await rl.question(`${label}${suffix}: `)).trim();
      if (answer) next[key] = answer;
    }
  } finally {
    rl.close();
  }
  return next;
};

export { promptIdentity };
