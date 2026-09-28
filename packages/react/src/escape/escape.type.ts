/* @layer renderer-shell @kind types */
interface EscapeLayer {
  isOpen: () => boolean;
  close: () => void;
}

interface EscapeLayerRegistry {
  add: (layer: EscapeLayer) => () => void;
  topmost: () => EscapeLayer | null;
}

type EscapeAction = 'layer' | 'dialog' | 'screen' | 'home' | 'none';

interface EscapeState {
  layerOpen: boolean;
  dialogOpen: boolean;
  screenOpen: boolean;
  homeAvailable: boolean;
}

export type { EscapeAction, EscapeLayer, EscapeLayerRegistry, EscapeState };
