/* @layer renderer-shell @kind logic */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { MenuConfig } from '../../menu/menu-config.type';
import { viewHidden } from '../../menu/view-hidden';
import { tuckedRows } from '../../shell/TitleBar/behavior/tucked-rows';
import type { MenuSnapshot } from '../review.type';

const tuckedLabels = (config: MenuConfig | undefined): string[] => {
  const { pinOnTop, unpin, fullscreen, exitFullscreen } = TESSERA_STRINGS.windows;
  const { pin, fullscreen: screen } = tuckedRows(config);
  const named = [pin, screen].flatMap((row) => [row?.label ?? '', row?.activeLabel ?? '']);
  return [pinOnTop, unpin, fullscreen, exitFullscreen, ...named].filter((label) => label !== '');
};

const withoutTuckedRows = (snapshot: MenuSnapshot, config: MenuConfig | undefined): MenuSnapshot => {
  if (!viewHidden(config)) return snapshot;
  const labels = tuckedLabels(config);
  return { ...snapshot, items: snapshot.items.filter((item) => !labels.includes(item.label)) };
};

export { withoutTuckedRows };
