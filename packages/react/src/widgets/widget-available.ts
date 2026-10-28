/* @layer renderer-shell @kind logic */
import type { AppContexts } from '../contexts/contexts.type';
import { DEFAULT_CONTEXT } from '../contexts/contexts.constants';
import { isShown } from '../screens/show/is-shown';
import type { ShowContext } from '../screens/show/show.type';
import { widgetContextsOf } from './widget-contexts-of';
import type { WidgetRuleParts } from './widget-available.type';

const contextOn = (contexts: AppContexts, name: string, legacy: boolean | null): boolean =>
  (name === DEFAULT_CONTEXT && legacy !== null ? legacy : contexts[name]?.active === true);

const widgetAvailable = (def: WidgetRuleParts, contexts: AppContexts, legacy: boolean | null, show?: ShowContext): boolean =>
  widgetContextsOf(def).some((name) => contextOn(contexts, name, legacy)) && isShown(def.when, show);

export { widgetAvailable };
