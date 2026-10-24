/* @layer tooling-scripts @kind logic */
import { writeBootFiles } from '../boot/write-boot-files.mjs';
import { writeStartupFile } from '../startup/write-startup.mjs';
import { writeTitleBarFile } from '../title-bar/write-title-bar.mjs';
import { writeToursFile } from '../tours/write-tours.mjs';
import { writeWidgetsFile } from '../widgets/write-widgets.mjs';

const LISTS = [
  [writeBootFiles, 'the boot task list'],
  [writeWidgetsFile, 'the widget list'],
  [writeTitleBarFile, 'the title bar item list'],
  [writeToursFile, 'the tour list'],
  [writeStartupFile, 'the start-up prompt list'],
];

/**
 * @param {string} rootDir the app root
 * @param {string} mode the command that asked, for the log line
 */
const writeGeneratedLists = (rootDir, mode) => {
  for (const [write, label] of LISTS) {
    for (const path of write(rootDir)) console.log(`brock ${mode}: wrote ${path}, ${label} changed`);
  }
};

export { writeGeneratedLists };
