/* @layer tooling-scripts @kind logic */
import { createInterface } from 'node:readline/promises';

/**
 * @param {string} question
 * @returns {Promise<boolean>} true only for an explicit yes
 */
const ask = async (question) => {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return /^y(es)?$/i.test((await prompt.question(`${question} [y/N] `)).trim());
  } finally {
    prompt.close();
  }
};

export { ask };
