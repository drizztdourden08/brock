/* @layer renderer-shell @kind logic */
import type { ControllerShape } from '../ControllerLayout.type';
import type { RectSpec } from './rect.type';

const rect = (spec: RectSpec): ControllerShape => ({ kind: 'rect', ...spec });

export { rect };
