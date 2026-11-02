/* @layer renderer-shell @kind logic */
import { Suspense, createElement } from 'react';
import type { ComponentType } from 'react';
import type { HubHeaderDef, HubRenderContext } from '../../hub/hub.type';
import type { BucketEntry, HeaderEntry } from './screen-tree.type';
import type { BucketDef } from './screens-config.type';

const mounted = (component: ComponentType<HubRenderContext>) => (ctx: HubRenderContext) =>
  createElement(Suspense, { fallback: null }, createElement(component, ctx));

const bucketHeader = (bucket: BucketDef, entries: readonly BucketEntry[]): HubHeaderDef | undefined => {
  const file = entries.find((entry): entry is HeaderEntry => entry.kind === 'header');
  if (file === undefined) return bucket.header;
  return { render: mounted(file.component), ...(file.actions === undefined ? {} : { actions: mounted(file.actions) }) };
};

export { bucketHeader };
