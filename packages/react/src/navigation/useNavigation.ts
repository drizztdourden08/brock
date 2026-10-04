/* @layer renderer-shell @kind hook */
import type { UseNavigationResult } from './navigation.type';
import { useNavigationStore } from './useNavigationStore';

const useNavigation = (): UseNavigationResult => {
  const active = useNavigationStore((s) => s.active);
  const params = useNavigationStore((s) => s.params);
  const open = useNavigationStore((s) => s.open);
  const close = useNavigationStore((s) => s.close);
  const back = useNavigationStore((s) => s.back);
  return { active, params, open, close, back };
};

export { useNavigation };
