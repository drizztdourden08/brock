/* @layer renderer-shell @kind util */
import type { CSSProperties } from 'react';
import { VIEW_H, VIEW_W } from '../ControllerLayout.constants';
import type { ControllerPlace } from '../ControllerLayout.type';

const share = (value: number, whole: number): string => `${((value / whole) * 100).toFixed(3)}%`;

const tagStyle = (tag: ControllerPlace['tag']): CSSProperties => {
  const vars: Record<`--${string}`, string> = {
    '--controller-tag-x': share(tag.x, VIEW_W),
    '--controller-tag-y': share(tag.y, VIEW_H),
  };
  return vars;
};

export { tagStyle };
