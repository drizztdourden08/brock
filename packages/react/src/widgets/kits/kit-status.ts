/* @layer renderer-shell @kind logic */
import type { AppContexts } from '../../contexts/contexts.type';
import type { KitStatus, WidgetKitDef } from './widget-kit.type';

const kitStatus = (kit: WidgetKitDef, contexts: AppContexts, developerTools: boolean, forced = false): KitStatus => {
  const { requires } = kit;
  return {
    shown: forced || kit.devOnly !== true || developerTools,
    reason: !forced && requires && contexts[requires.context]?.active !== true ? requires.reason : null,
  };
};

export { kitStatus };
