/* @layer electron-main @kind logic */
import type { ToolDef, ToolLocation, ToolState, ToolStatus } from '../tools.type';

const statusOf = (location: ToolLocation | null, canInstall: boolean): ToolStatus => {
  if (location) return 'ready';
  return canInstall ? 'missing' : 'unavailable';
};

const hintFor = (def: ToolDef, location: ToolLocation | null, canInstall: boolean): string | null => {
  if (location || canInstall) return null;
  return def.installHint ?? `Install ${def.label} and make sure it is on PATH.`;
};

const toolState = (def: ToolDef, location: ToolLocation | null, canInstall: boolean): ToolState => ({
  id: def.id,
  label: def.label,
  status: statusOf(location, canInstall),
  source: location?.source ?? null,
  paths: location?.paths ?? null,
  canInstall,
  hint: hintFor(def, location, canInstall),
});

export { toolState };
