/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { controlSources } from '../../control-sources';
import type { ControlSources } from '../../control-sources.type';

const useControlSources = (sources: ControlSources): void => {
  const { tabs, settings, screens, tree } = sources;
  useEffect(() => controlSources.publish({ tabs, settings, screens, tree }), [tabs, settings, screens, tree]);
};

export { useControlSources };
