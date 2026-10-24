/* @layer renderer-shell @kind logic */
import { GEOMETRY } from './controller-geometry.constants';
import type { ControllerGeometry, ControllerLayoutVariant } from '../ControllerLayout.type';

const controllerGeometry = (variant: ControllerLayoutVariant): ControllerGeometry => GEOMETRY[variant];

export { controllerGeometry };
