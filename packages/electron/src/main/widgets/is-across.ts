/* @layer electron-main @kind logic */
import type { WidgetEdge } from '@drizztdourden08/brock-core';

const isAcross = (edge: WidgetEdge): boolean => edge === 'left' || edge === 'right';

export { isAcross };
