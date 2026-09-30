/* @layer tooling-scripts @kind logic */
import { BOOT_SIDES } from './boot.constants.mjs';
import { renderBootRegistry } from './render-boot-registry.mjs';
import { scanBootTasks } from './scan-boot-tasks.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {{ path: string, content: string }[]}  .brock/boot.renderer.ts and .brock/boot.main.ts
 */
const renderBootFiles = (rootDir) => BOOT_SIDES.map((side) => ({ path: side.path, content: renderBootRegistry(side, scanBootTasks(rootDir, side.dir)) }));

export { renderBootFiles };
