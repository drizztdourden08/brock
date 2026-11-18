/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { KitOverlayDef, WidgetKitDef } from './widget-kit.type';

const NO_KITS: readonly WidgetKitDef[] = [];
const NO_OVERLAYS: readonly KitOverlayDef[] = [];
const KIT_KEY_PREFIX = 'kit-';
const KIT_OVERLAY_KEY_PREFIX = 'overlay-';
const KIT_ICON: IconName = 'wrench';
const KIT_OPEN_ICON: IconName = 'play';
const KIT_OVERLAY_ICON: IconName = 'layers';

const KIT_WORDS = {
  open: msg('brock-app:kit.open'),
  close: msg('brock-app:kit.close'),
  reset: msg('brock-app:kit.reset'),
} as const;

export { KIT_ICON, KIT_OPEN_ICON, KIT_KEY_PREFIX, KIT_OVERLAY_ICON, KIT_OVERLAY_KEY_PREFIX, KIT_WORDS, NO_KITS, NO_OVERLAYS };
