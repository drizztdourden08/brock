/* @layer tooling-scripts @kind entry */
import { setTimeout as delay } from 'node:timers/promises';
import { storeViteDeps } from './vite-deps-cache.mjs';
import { WAIT_LIMIT_MS, WAIT_POLL_MS } from './vite-deps.constants.mjs';

const input = JSON.parse(process.argv[2]);
const until = Date.now() + WAIT_LIMIT_MS;
let outcome = await storeViteDeps(input).catch(() => 'skipped');
while (outcome === 'not-ready' && Date.now() < until) {
  await delay(WAIT_POLL_MS);
  outcome = await storeViteDeps(input).catch(() => 'skipped');
}
