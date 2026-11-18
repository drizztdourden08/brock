/* @layer core @kind constants */
import type { LayerKind } from './catalog.type';

const LAYER_RANK: Readonly<Record<LayerKind, number>> = { package: 0, module: 1, app: 2 };

export { LAYER_RANK };
