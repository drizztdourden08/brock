/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ComponentType } from 'react';
import type { CardProps } from '../kinds/screen-kinds.type';
import { assertWindow } from './assert-window';
import { SideNavWindow } from './SideNavWindow';
import type { WindowDef } from './window.type';

const defineWindow = (def: WindowDef): ComponentType<CardProps> => {
  assertWindow(def);
  return (ctx: CardProps) => createElement(SideNavWindow, { def, ctx });
};

export { defineWindow };
