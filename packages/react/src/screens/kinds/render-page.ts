/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { HubRenderContext } from '../../hub/hub.type';
import type { BucketDef } from '../conventions/screens-config.type';
import { pageProps } from './page-props';
import type { PageProps } from './screen-kinds.type';

const renderPage = (component: ComponentType<PageProps>, bucket: BucketDef) => (ctx: HubRenderContext): ReactNode =>
  createElement(component, pageProps(bucket, ctx));

export { renderPage };
