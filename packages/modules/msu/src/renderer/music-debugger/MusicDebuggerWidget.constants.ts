/* @layer renderer-shell @kind constants */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import type { MsuDebugOwner } from '../../types';

const OWNER_LABELS: Record<MsuDebugOwner, string> = { pack: 'MSU', chip: 'CHIP', skipped: 'SKIP' };
const OWNER_VARIANTS: Record<MsuDebugOwner, StatusTone> = {
  pack: 'success', chip: 'warning', skipped: 'neutral',
};

const NONE = '-';

const MUSIC_DEBUGGER_META: WidgetMeta = {
  label: 'Music Debugger',
  padding: 'none',
  icon: 'headphones',
  order: 8,
  defaultSide: 'right',
  defaultDockedSize: 420,
  defaultFloatingSize: { width: 420, height: 560 },
  context: 'game',
  devOnly: true,
};

export { MUSIC_DEBUGGER_META, NONE, OWNER_LABELS, OWNER_VARIANTS };
