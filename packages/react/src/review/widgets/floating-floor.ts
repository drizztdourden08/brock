/* @layer renderer-shell @kind logic */
import type { Size } from '@drizztdourden08/tessera/composites';

const floatingFloor = (min: Size, main: Size | undefined): Size =>
  main ? { width: Math.min(min.width, main.width), height: Math.min(min.height, main.height) } : min;

export { floatingFloor };
