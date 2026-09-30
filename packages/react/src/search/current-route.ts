/* @layer renderer-shell @kind logic */
import { joinRoute } from '../navigation/join-route';
import { useNavigationStore } from '../navigation/useNavigationStore';

const paramText = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

const currentRoute = (): string | null => {
  const { active, params } = useNavigationStore.getState();
  return active === null ? null : joinRoute(active, paramText(params.section), paramText(params.tab));
};

export { currentRoute };
