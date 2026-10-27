/* @layer renderer-shell @kind logic */
import type { LayoutPreset } from './layout-preset.type';

const held: { saved: number | undefined } = { saved: undefined };

const sane = (value: unknown): number | undefined =>
  (typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : undefined);

const presetRevision = (preset: LayoutPreset | null): number | undefined => (preset ? sane(preset.revision) ?? 1 : undefined);

const layoutRevision = {
  saved: (): number | undefined => held.saved,
  adopt: (revision: number | undefined): void => {
    if (revision !== undefined) held.saved = revision;
  },
  start: (revision: number | undefined): void => {
    held.saved = revision;
  },
  stored: sane,
  ofPreset: presetRevision,
  field: (): { widgetLayoutRevision?: number } => (held.saved === undefined ? {} : { widgetLayoutRevision: held.saved }),
};

export { layoutRevision };
