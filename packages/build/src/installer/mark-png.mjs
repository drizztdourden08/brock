/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { imageSvg } from './image-svg.mjs';
import { HEADER_OVERRIDE, INSTALLER_DIR, MARK_SIZE } from './installer.constants.mjs';
import { markSourceOf } from './mark-source.mjs';
import { rasteriseSvg } from './rasterise-svg.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {import('./installer-inputs.mjs').InstallerInputs} inputs
 * @returns {{ png: Buffer, from: string }}  the image the downloader draws on top
 */
const markPng = (rootDir, inputs) => {
  const override = join(INSTALLER_DIR, HEADER_OVERRIDE);
  if (existsSync(join(rootDir, override))) return { png: readFileSync(join(rootDir, override)), from: override };
  const source = markSourceOf(rootDir, inputs);
  if (!source) throw new Error(`The installer needs a mark: ${inputs.config.logos.mark} under public/ (brock icons writes it from icons.brand), or ${override}`);
  if (source.mime === 'image/png') return { png: source.data, from: source.from };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_SIZE} ${MARK_SIZE}">${imageSvg(source, { x: 0, y: 0, size: MARK_SIZE })}</svg>`;
  return { png: rasteriseSvg(svg, MARK_SIZE), from: source.from };
};

export { markPng };
