/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { KitOverlayDef, WidgetKitDef } from '../kits/widget-kit.type';

interface KitLayerProps {
  kit: WidgetKitDef;
  hidden: readonly string[];
  reason: Text | null;
  onClose: () => void;
}

interface KitBarProps {
  kit: WidgetKitDef;
  onClose: () => void;
}

interface KitWaitingProps {
  kit: WidgetKitDef;
  reason: Text;
  onClose: () => void;
}

interface KitOverlayProps {
  overlay: KitOverlayDef;
}

export type { KitBarProps, KitLayerProps, KitOverlayProps, KitWaitingProps };
