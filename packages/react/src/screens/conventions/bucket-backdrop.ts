/* @layer renderer-shell @kind logic */
import { Suspense, createElement } from 'react';
import type { BackdropEntry, BucketEntry } from './screen-tree.type';
import type { BucketDef, PageBackdrop } from './screens-config.type';

const bucketBackdrop = (bucket: BucketDef, entries: readonly BucketEntry[]): PageBackdrop | undefined => {
  const file = entries.find((entry): entry is BackdropEntry => entry.kind === 'backdrop');
  if (file === undefined) return bucket.backdrop;
  return { kind: 'node', node: createElement(Suspense, { fallback: null }, createElement(file.component)) };
};

export { bucketBackdrop };
