/* @layer tooling-scripts @kind logic */
import { LOCK_SLACK_MS } from './ci.constants.mjs';

const DEFAULT_MINUTES = Object.freeze({ install: 10, structure: 5, 'lint:md': 5, lint: 15, test: 20, 'app:build': 10 });
const RELEASE_MINUTES = Object.freeze({ lint: 45 });
const FALLBACK_MINUTES = 30;

const baseName = (name) => name.split(' / ').at(-1).replace(/ \(\d+\)$/, '');

/**
 * @param {string | undefined} text `test=30,lint=20`
 * @returns {Record<string, number>} minutes by step name
 */
const parseTimeouts = (text) => {
  const out = {};
  for (const part of (text ?? '').split(',').map((item) => item.trim()).filter(Boolean)) {
    const [name, minutes] = part.split('=');
    if (!name || !(Number(minutes) > 0)) throw new Error(`--timeout takes name=minutes pairs like test=30,lint=20, got "${part}".`);
    out[name] = Number(minutes);
  }
  return out;
};

/**
 * @param {string} name the step name
 * @param {{ overrides?: Record<string, number>, trigger?: string }} [options]
 * @returns {number} the hard limit of the step in milliseconds
 */
const timeoutMs = (name, { overrides = {}, trigger = 'manual' } = {}) => {
  const key = baseName(name);
  const release = trigger === 'release' ? RELEASE_MINUTES[key] : undefined;
  return (overrides[key] ?? release ?? DEFAULT_MINUTES[key] ?? FALLBACK_MINUTES) * 60000;
};

/**
 * @param {object[]} steps the planned steps that still have to run
 * @param {{ overrides?: Record<string, number>, trigger?: string }} [options]
 * @returns {number} the longest a run of those steps may hold the lock
 */
const runBudgetMs = (steps, options) => steps.reduce((total, step) => total + timeoutMs(step.name, options), LOCK_SLACK_MS);

export { parseTimeouts, runBudgetMs, timeoutMs };
