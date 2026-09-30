/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { ScreenRenderContext } from '../screen.type';
import type { CardProps } from './screen-kinds.type';

const renderCard = (component: ComponentType<CardProps>) => (ctx: ScreenRenderContext): ReactNode =>
  createElement(component, { params: ctx.params, profile: ctx.profile, open: ctx.open, close: ctx.close });

export { renderCard };
