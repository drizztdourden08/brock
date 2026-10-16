/* @layer renderer-shell @kind types */
import type { KitOverlayDef, WidgetKitDef } from '../kits/widget-kit.type';

interface KitLayerProps {
  kit: WidgetKitDef;
  hidden: readonly string[];
  reason: string | null;
  onClose: () => void;
}

interface KitBarProps {
  kit: WidgetKitDef;
  onClose: () => void;
}

interface KitWaitingProps {
  kit: WidgetKitDef;
  reason: string;
  onClose: () => void;
}

interface KitOverlayProps {
  overlay: KitOverlayDef;
}

export type { KitBarProps, KitLayerProps, KitOverlayProps, KitWaitingProps };
