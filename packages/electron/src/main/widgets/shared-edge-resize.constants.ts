/* @layer electron-main @kind constants */
import type { EdgeSide } from './widget-windows.type';

const EDGE_SIDES: readonly EdgeSide[] = [
  { axis: 'x', far: false }, { axis: 'x', far: true }, { axis: 'y', far: false }, { axis: 'y', far: true },
];

export { EDGE_SIDES };
