/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { HubRenderContext } from '../../hub/hub.type';
import type { BucketDef } from '../conventions/screens-config.type';
import { HERO_FRAME } from './hero-frame.constants';
import { pageProps } from './page-props';
import type { HeroProps } from './screen-kinds.type';

const renderHero = (component: ComponentType<HeroProps>, bucket: BucketDef) => (ctx: HubRenderContext): ReactNode =>
  createElement(HERO_FRAME.Root, HERO_FRAME.rootProps, createElement(component, { ...pageProps(bucket, ctx), slots: HERO_FRAME.slots }));

export { renderHero };
