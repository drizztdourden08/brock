/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import pngjs from 'pngjs';
import { SPLASH_FALLBACK_SIZE, SPLASH_FILE, SPLASH_ICON_SIZE } from './packaging.constants.mjs';

const { PNG } = pngjs;

/**
 * @param {string | undefined} hex
 * @returns {number[]}
 */
const rgbOf = (hex) => {
  const digits = (hex ?? '').replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits.slice(0, 6);
  if (!/^[0-9a-f]{6}$/i.test(full)) return [0, 0, 0];
  return [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16));
};

const fillCanvas = (canvas, [r, g, b]) => {
  for (let i = 0; i < canvas.data.length; i += 4) {
    canvas.data[i] = r;
    canvas.data[i + 1] = g;
    canvas.data[i + 2] = b;
    canvas.data[i + 3] = 255;
  }
};

const blendPixel = (dst, at, src, from) => {
  const alpha = src[from + 3] / 255;
  for (let c = 0; c < 3; c += 1) dst[at + c] = Math.round(src[from + c] * alpha + dst[at + c] * (1 - alpha));
};

const drawCentred = (canvas, icon) => {
  if (icon.width > canvas.width || icon.height > canvas.height) {
    throw new Error(`The splash icon (${icon.width}x${icon.height}) is larger than the splash (${canvas.width}x${canvas.height})`);
  }
  const left = Math.floor((canvas.width - icon.width) / 2);
  const top = Math.floor((canvas.height - icon.height) / 2);
  for (let y = 0; y < icon.height; y += 1) {
    for (let x = 0; x < icon.width; x += 1) {
      blendPixel(canvas.data, ((top + y) * canvas.width + left + x) * 4, icon.data, (y * icon.width + x) * 4);
    }
  }
};

/**
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {string | null}
 */
const splashIconOf = (product) => {
  const icons = product.icons ?? {};
  return icons.brand ? join('build', 'icons', 'png', `icon-${SPLASH_ICON_SIZE}.png`) : (icons.png256 ?? null);
};

/**
 * @param {string} rootDir
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {string | null} the root-relative splash, or null without an icon
 */
const writeInstallerSplash = (rootDir, product) => {
  const iconRel = splashIconOf(product);
  if (!iconRel || !existsSync(join(rootDir, iconRel))) return null;
  const { width, height } = product.window?.splash ?? SPLASH_FALLBACK_SIZE;
  const canvas = new PNG({ width, height });
  fillCanvas(canvas, rgbOf(product.window?.backgroundColor));
  drawCentred(canvas, PNG.sync.read(readFileSync(join(rootDir, iconRel))));
  const out = join(rootDir, SPLASH_FILE);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, PNG.sync.write(canvas));
  return SPLASH_FILE;
};

export { writeInstallerSplash };
