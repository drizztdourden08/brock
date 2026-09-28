/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { copyFiles } from '../copy-files.mjs';
import { isCurrent } from '../is-current.mjs';
import { botSvg } from './bot-svg.mjs';
import { BOT_BRAND_DIR, BOT_BRAND_FILES, BOT_SOURCES, BOT_TARGETS, ICO_SIZES } from './bot.constants.mjs';
import { downscale } from './downscale.mjs';
import { encodeIco } from './encode-ico.mjs';
import { readPng } from './read-png.mjs';
import { stampBadge } from './stamp-badge.mjs';
import { writePng } from './write-png.mjs';

/**
 * @param {string} brandDir
 * @returns {{ to: string, body: string | Buffer }[]}
 */
const renderBotFiles = (brandDir) => {
  const stamped = stampBadge(readPng(readFileSync(join(brandDir, BOT_SOURCES.png))));
  const png = writePng(stamped);
  const ico = encodeIco(ICO_SIZES.map((size) => ({
    size,
    png: size === stamped.width ? png : writePng(downscale(stamped, stamped.width / size)),
  })));
  return [
    { to: BOT_TARGETS.svg, body: botSvg(readFileSync(join(brandDir, BOT_SOURCES.svg))) },
    { to: BOT_TARGETS.png, body: png },
    { to: BOT_TARGETS.ico, body: ico },
  ];
};

/**
 * @param {string} brandDir @param {string} rootDir
 */
const botFilesCurrent = (brandDir, rootDir) => Object.values(BOT_TARGETS).every((to) =>
  Object.values(BOT_SOURCES).every((from) => isCurrent(join(brandDir, from), join(rootDir, to))));

/**
 * @param {string} brandDir @param {string} rootDir @param {boolean} force
 * @returns {import('../copy-files.mjs').WriteReport}
 */
const writeBotVariant = (brandDir, rootDir, force) => {
  if (existsSync(join(brandDir, BOT_BRAND_DIR))) return copyFiles(brandDir, rootDir, BOT_BRAND_FILES, force);
  const targets = Object.values(BOT_TARGETS);
  if (!force && botFilesCurrent(brandDir, rootDir)) return { written: [], current: targets };
  for (const { to, body } of renderBotFiles(brandDir)) {
    const target = join(rootDir, to);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
  }
  return { written: targets, current: [] };
};

export { writeBotVariant };
