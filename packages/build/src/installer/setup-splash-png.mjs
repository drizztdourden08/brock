/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INSTALLER_DIR, SPLASH_OVERRIDE } from './installer.constants.mjs';
import { markSourceOf } from './mark-source.mjs';
import { rasteriseSvg } from './rasterise-svg.mjs';
import { setupSplashSvg } from './setup-splash-svg.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('./installer-inputs.mjs').InstallerInputs} inputs
 * @returns {{ png: Buffer, from: string }}  the image Velopack's Setup shows
 */
const setupSplashPng = (rootDir, inputs) => {
  const { config, colours } = inputs;
  const override = join(INSTALLER_DIR, SPLASH_OVERRIDE);
  if (existsSync(join(rootDir, override))) return { png: readFileSync(join(rootDir, override)), from: override };
  const mark = markSourceOf(rootDir, inputs);
  if (!mark) throw new Error(`The Setup splash needs a mark: ${config.logos.mark} under public/ (brock icons writes it from icons.brand), or ${override}`);
  const { width, height } = config.window.splash;
  const svg = setupSplashSvg({ width, height, colours, mark, name: config.window.title ?? config.name });
  return { png: rasteriseSvg(svg, width), from: 'the look' };
};

export { setupSplashPng };
