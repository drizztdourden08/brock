/* @layer renderer-shell @kind logic */
import type { AppContexts } from '../../contexts/contexts.type';
import type { KitStatus, WidgetKitDef } from './widget-kit.type';

const kitStatus = (kit: WidgetKitDef, contexts: AppContexts, developerTools: boolean): KitStatus => {
  const { requires } = kit;
  return {
    shown: kit.devOnly !== true || developerTools,
    reason: requires && contexts[requires.context]?.active !== true ? requires.reason : null,
  };
};

export { kitStatus };
