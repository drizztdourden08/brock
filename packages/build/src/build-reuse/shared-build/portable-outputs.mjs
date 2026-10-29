/* @layer tooling-scripts @kind logic */
import { pathToFileURL } from 'node:url';
import { ROOT_TOKENS, TEXT_OUTPUT } from './shared-build.constants.mjs';

const BACKSLASH = String.fromCharCode(92);

const spellings = (rootDir) => [
  [pathToFileURL(rootDir).href, ROOT_TOKENS.url],
  [rootDir.split(BACKSLASH).join('/'), ROOT_TOKENS.posix],
  [rootDir, ROOT_TOKENS.native],
].filter(([form], index, all) => all.findIndex(([other]) => other === form) === index).sort((a, b) => b[0].length - a[0].length);

const swapText = (text, pairs) => pairs.reduce((out, [from, to]) => out.split(from).join(to), text);

const isText = (fileName) => TEXT_OUTPUT.test(fileName);

const mapOutputs = (outputs, pairs) => outputs.map((item) => {
  if (!isText(item.fileName)) return item;
  return { ...item, base64: Buffer.from(swapText(Buffer.from(item.base64, 'base64').toString('utf8'), pairs)).toString('base64') };
});

const leaksRoot = (outputs, rootDir) => {
  const needles = [rootDir, rootDir.split(BACKSLASH).join(BACKSLASH + BACKSLASH), rootDir.split(BACKSLASH).join('/')].map((form) => form.toLowerCase());
  return outputs.some((item) => {
    const text = Buffer.from(item.base64, 'base64').toString('latin1').toLowerCase();
    return needles.some((needle) => text.includes(needle));
  });
};

/**
 * @param {{ fileName: string, base64: string }[]} outputs the bundle as the plugin recorded it
 * @param {string} rootDir the app root of the worktree that built it
 * @returns {{ outputs: { fileName: string, base64: string }[], clean: boolean }} clean: no path of this worktree is left in them
 */
const portableOutputs = (outputs, rootDir) => {
  const swapped = mapOutputs(outputs, spellings(rootDir));
  return { outputs: swapped, clean: !leaksRoot(swapped, rootDir) };
};

/**
 * @param {{ fileName: string, base64: string }[]} outputs a stored bundle with root tokens
 * @param {string} rootDir the app root of the worktree that restores it
 * @returns {{ fileName: string, base64: string }[]} the same bundle with this worktree's paths
 */
const localOutputs = (outputs, rootDir) => mapOutputs(outputs, spellings(rootDir).map(([form, token]) => [token, form]));

export { localOutputs, portableOutputs };
