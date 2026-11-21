/* @layer electron-main @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { ToolDef, ToolLocation, ToolState, ToolStatus } from '../tools.type';

const statusOf = (location: ToolLocation | null, canInstall: boolean): ToolStatus => {
  if (location) return 'ready';
  return canInstall ? 'missing' : 'unavailable';
};

const hintFor = (def: ToolDef, location: ToolLocation | null, canInstall: boolean): Text | null => {
  if (location || canInstall) return null;
  return def.installHint ?? msg('tools:install.hint', { label: def.label });
};

const toolState = (def: ToolDef, location: ToolLocation | null, canInstall: boolean): ToolState => ({
  id: def.id,
  label: def.label,
  status: statusOf(location, canInstall),
  source: location?.source ?? null,
  paths: location?.paths ?? null,
  canInstall,
  hint: hintFor(def, location, canInstall),
  version: location?.version ?? null,
});

export { toolState };
