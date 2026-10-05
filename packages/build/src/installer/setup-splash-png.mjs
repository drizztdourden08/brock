/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INSTALLER_DIR, SPLASH_OVERRIDE } from './installer.constants.mjs';
import { markSourceOf } from './mark-source.mjs';
import { rasteriseSvg } from './rasterise-svg.mjs';
import { setupSplashSvg } from './setup-splash-svg.mjs';
import { titleFont } from './title-font.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('./installer-inputs.mjs').InstallerInputs} inputs
 * @returns {{ png: Buffer, from: string }}  the image Velopack's Setup shows
 */
const setupSplashPng = (rootDir, inputs) => {
  const { config, colours, splash } = inputs;
  const override = join(INSTALLER_DIR, SPLASH_OVERRIDE);
  if (existsSync(join(rootDir, override))) return { png: readFileSync(join(rootDir, override)), from: override };
  const mark = markSourceOf(rootDir, inputs, { ground: 'dark' });
  if (!mark) throw new Error(`The Setup splash needs a mark: ${config.logos.mark} under public/ (brock icons writes it from icons.brand), or ${override}`);
  const { width, height } = config.window.splash;
  const font = titleFont(inputs.tesseraRoot);
  const name = config.window.title ?? config.name;
  const svg = setupSplashSvg({ width, height, ground: splash, angle: colours.angle, mark, name, family: font?.family });
  return { png: rasteriseSvg(svg, width, font?.file), from: `the dark ground, mark from ${mark.from}, name in ${font?.family ?? 'Segoe UI'}` };
};

export { setupSplashPng };
