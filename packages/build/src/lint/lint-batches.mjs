/* @layer tooling-scripts @kind logic */
import { BATCH_ENV, BATCH_SIZE } from './lint.constants.mjs';

/**
 * @param {NodeJS.ProcessEnv} [env] BROCK_LINT_BATCH_SIZE sets another size
 * @returns {number} files per eslint process on a full-tree run
 */
const batchSizeOf = (env = process.env) => {
  const wanted = Number(env[BATCH_ENV]);
  return Number.isInteger(wanted) && wanted > 0 ? wanted : BATCH_SIZE;
};

/**
 * @param {string[]} files the sorted file list
 * @param {number} size files per batch
 * @returns {string[][]} contiguous slices of at most size files, none empty
 */
const splitBatches = (files, size) => {
  const batches = [];
  for (let at = 0; at < files.length; at += size) batches.push(files.slice(at, at + size));
  return batches;
};

/**
 * @param {number[]} codes the exit code of every batch
 * @returns {number} the highest code of any batch
 */
const worstExit = (codes) => codes.reduce((worst, code) => Math.max(worst, code), 0);

/**
 * @param {string[][]} batches the file slices
 * @param {(batch: string[], index: number) => Promise<number>} runOne lints one slice in its own process
 * @returns {Promise<{ code: number, codes: number[] }>} the worst code and each batch code
 */
const runBatches = async (batches, runOne) => {
  const codes = [];
  for (const [index, batch] of batches.entries()) codes.push(await runOne(batch, index));
  return { code: worstExit(codes), codes };
};

export { batchSizeOf, runBatches, splitBatches, worstExit };
