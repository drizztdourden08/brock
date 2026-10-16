/* @layer core @kind logic */
import type { ProductWordmark, ProductWordmarkInput } from './product.type';
import { WORDMARK_FILE } from './define-product.constants';

const assertWordmarkPath = (field: string, path: string): void => {
  if (!WORDMARK_FILE.test(path) || path.split(/[\\/]+/).includes('..')) {
    throw new Error(`product.icons.${field} "${path}" must be an .svg or .png under public/, like "./logos/wordmark.svg"`);
  }
};

const resolveWordmark = (input: ProductWordmarkInput | undefined): ProductWordmark | undefined => {
  if (input === undefined) return undefined;
  const { src, dark = src } = typeof input === 'string' ? { src: input } : input;
  assertWordmarkPath(typeof input === 'string' ? 'wordmark' : 'wordmark.src', src);
  if (dark !== src) assertWordmarkPath('wordmark.dark', dark);
  return { src, dark };
};

export { resolveWordmark };
