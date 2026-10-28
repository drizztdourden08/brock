/* @layer renderer-shell @kind logic */
import { isRecord } from '../../collections/is-record';
import type { StoredWorkspaceView } from './workspace.type';

const readWorkspaceViews = (stored: unknown): Record<string, StoredWorkspaceView> => {
  if (!isRecord(stored)) return {};
  return Object.fromEntries(Object.entries(stored).flatMap(([id, entry]) => (
    isRecord(entry) && 'widgetLayout' in entry && 'toolbarLayout' in entry ? [[id, { widgetLayout: entry.widgetLayout, toolbarLayout: entry.toolbarLayout }]] : []
  )));
};

export { readWorkspaceViews };
