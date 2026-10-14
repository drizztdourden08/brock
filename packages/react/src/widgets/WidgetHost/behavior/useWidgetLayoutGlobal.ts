/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { windowGlobal } from '../../../host/window-global';
import { readWidgetLayout } from '../../read-widget-layout';
import { WIDGET_LAYOUT_GLOBAL } from '../../widget.constants';

const useWidgetLayoutGlobal = (): void => {
  useEffect(() => {
    if (!isAutomationLaunch()) return undefined;
    windowGlobal.write(WIDGET_LAYOUT_GLOBAL, readWidgetLayout);
    return () => { windowGlobal.remove(WIDGET_LAYOUT_GLOBAL); };
  }, []);
};

export { useWidgetLayoutGlobal };
