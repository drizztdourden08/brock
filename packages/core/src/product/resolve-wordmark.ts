/* @layer core @kind logic */
import type { ProductWordmark, ProductWordmarkInput, ProductWordmarkRendering } from './product.type';
import { WORDMARK_FILE, WORDMARK_RENDERINGS } from './define-product.constants';

const assertWordmarkPath = (field: string, path: string): void => {
  if (!WORDMARK_FILE.test(path) || path.split(/[\\/]+/).includes('..')) {
    throw new Error(`product.icons.${field} "${path}" must be an .svg or .png under public/, like "./logos/wordmark.svg"`);
  }
};

const assertRendering = (rendering: ProductWordmarkRendering): void => {
  if (!WORDMARK_RENDERINGS.includes(rendering)) {
    throw new Error(`product.icons.wordmark.rendering "${String(rendering)}" must be one of ${WORDMARK_RENDERINGS.join(', ')}`);
  }
};

const resolveWordmark = (input: ProductWordmarkInput | undefined): ProductWordmark | undefined => {
  if (input === undefined) return undefined;
  const { src, dark = src, rendering = 'auto' } = typeof input === 'string' ? { src: input } : input;
  assertWordmarkPath(typeof input === 'string' ? 'wordmark' : 'wordmark.src', src);
  if (dark !== src) assertWordmarkPath('wordmark.dark', dark);
  assertRendering(rendering);
  return rendering === 'pixelated' ? { src, dark, rendering } : { src, dark };
};

export { resolveWordmark };
