/* @layer renderer-shell @kind component */
import { useContextsStore } from '../../contexts/useContextsStore';
import { useRuleContext } from '../useRuleContext';
import { useForcedWidgetStore } from '../useForcedWidgetStore';
import { widgetAvailable } from '../widget-available';
import type { WidgetFaceProps } from './WidgetFace.type';

const WidgetFace = ({ def }: WidgetFaceProps) => {
  const contexts = useContextsStore((s) => s.contexts);
  const show = useRuleContext();
  const forced = useForcedWidgetStore((s) => s.ids.includes(def.id));
  const empty = forced && def.empty !== undefined && !widgetAvailable(def, contexts, null, show);
  return <>{empty && def.empty ? def.empty() : def.render()}</>;
};

export { WidgetFace };
