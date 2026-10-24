/* @layer renderer-shell @kind types */
import type { ControllerShape } from '../ControllerLayout.type';

type RectSpec = Omit<Extract<ControllerShape, { kind: 'rect' }>, 'kind'>;

export type { RectSpec };
