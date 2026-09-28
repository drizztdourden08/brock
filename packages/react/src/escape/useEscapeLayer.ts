/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { EscapeLayer } from './escape.type';
import { escapeLayers } from './escape-layers';

const useEscapeLayer = (layer: EscapeLayer): void => {
  useEffect(() => escapeLayers.add(layer), [layer]);
};

export { useEscapeLayer };
