/* @layer renderer-shell @kind logic */
import type { EscapeLayer, EscapeLayerRegistry } from './escape.type';

const layers: EscapeLayer[] = [];

const escapeLayers: EscapeLayerRegistry = {
  add: (layer) => {
    layers.push(layer);
    return () => {
      const at = layers.lastIndexOf(layer);
      if (at >= 0) layers.splice(at, 1);
    };
  },
  topmost: () => [...layers].reverse().find((layer) => layer.isOpen()) ?? null,
};

export { escapeLayers };
