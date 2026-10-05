/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { contexts } from '../../../contexts/contexts';
import { DEFAULT_CONTEXT } from '../../../contexts/contexts.constants';
import type { WidgetContextSource } from '../WidgetHost.type';

const noSource = (): null => null;

const useLegacyWidgetContext = (source?: WidgetContextSource): boolean | null => {
  const useSource: () => boolean | null = source ?? noSource;
  const active = useSource();
  useEffect(() => {
    if (active !== null) contexts.set(DEFAULT_CONTEXT, { active });
  }, [active]);
  return active;
};

export { useLegacyWidgetContext };
