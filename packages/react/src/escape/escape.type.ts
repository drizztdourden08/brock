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

interface TextField {
  tagName: string;
  type?: string;
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  dispatchEvent: (event: Event) => boolean;
}

export type { EscapeAction, EscapeLayer, EscapeLayerRegistry, EscapeState, TextField };
