/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { HubRenderContext } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
import type { BucketDef } from '../conventions/screens-config.type';
import { pageProps } from './page-props';
import type { SubPageProps } from './screen-kinds.type';

const renderSub = (component: ComponentType<SubPageProps>, bucket: BucketDef) => (ctx: HubRenderContext): ReactNode =>
  createElement(component, {
    ...pageProps(bucket, ctx),
    sub: ctx.sub?.id ?? '',
    subParams: ctx.subParams,
    back: () => nav.up({ section: ctx.page.id }),
  });

export { renderSub };
