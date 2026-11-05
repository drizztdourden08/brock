/* @layer renderer-components @kind logic */
import { lookupGlyph } from '../../../renderer/lookup-glyph';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import type { GlyphSource } from '../../../renderer/glyph-source.type';
import { GENERIC_ICON_FAMILY } from '../ControlsSettings.constants';
import type { DeviceIconIds } from '../ControlsSettings.type';

const deviceIconUrl = (
  ids: DeviceIconIds,
  sources: readonly GlyphSource[] = useGlyphSourceStore.getState().sources,
): string | null => {
  const keys = [ids.sdlType, ids.family, GENERIC_ICON_FAMILY].filter((key): key is string => Boolean(key));
  for (const key of keys) {
    const url = lookupGlyph(sources, (source) => source.controller?.(key));
    if (url) return url;
  }
  return null;
};

export { deviceIconUrl };
