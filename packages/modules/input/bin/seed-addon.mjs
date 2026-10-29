/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { addonPathsOf, readPins, rememberInstalled } from '../ensure-addon/index.mjs';
import { LOG_TAG } from '../ensure-addon/addon.constants.mjs';

const log = (message) => console.log(`${LOG_TAG} ${message}`);
const MESSAGES = Object.freeze({
  stored: 'Stored the installed addon in the build cache.',
  present: 'The build cache already holds an intact copy; nothing changed.',
  unmatched: 'That copy has no current addon for its pins and this platform; nothing stored.',
  failed: 'The build cache could not take the addon; nothing stored.',
});

const target = process.argv[2];
if (!target) {
  console.error(`${LOG_TAG} Usage: node bin/seed-addon.mjs <path to an installed @drizztdourden08/brock-input folder>`);
  process.exitCode = 1;
} else {
  try {
    const paths = addonPathsOf(resolve(target), undefined, process.env);
    const status = await rememberInstalled({ paths, pins: readPins(paths.nativeDir), force: false, log, env: process.env });
    log(MESSAGES[status]);
    if (status === 'unmatched' || status === 'failed') process.exitCode = 1;
  } catch (error) {
    console.error(`${LOG_TAG} ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
