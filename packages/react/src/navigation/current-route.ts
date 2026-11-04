/* @layer renderer-shell @kind logic */
import { controlSources } from '../app/control-sources';
import { joinRoute } from './join-route';
import { useNavigationStore } from './useNavigationStore';

const textOf = (value: unknown): string | undefined => (typeof value === 'string' && value !== '' ? value : undefined);

const currentRoute = (): string | null => {
  const { active, params } = useNavigationStore.getState();
  if (active === null) return controlSources.get().tree?.base ?? null;
  return joinRoute(active, textOf(params.section), textOf(params.tab));
};

export { currentRoute };
