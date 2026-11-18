/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useText } from '../../../i18n';
import { controlSources } from '../../control-sources';
import type { ControlSources } from '../../control-sources.type';

const useControlSources = (sources: Omit<ControlSources, 'text'>): void => {
  const { tabs, settings, screens, tree } = sources;
  const text = useText();
  useEffect(() => controlSources.publish({ tabs, settings, screens, tree, text }), [tabs, settings, screens, tree, text]);
};

export { useControlSources };
