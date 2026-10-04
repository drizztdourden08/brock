/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { isAutomationLaunch } from '../../../host/is-automation-launch';
import { readWidgetLayout } from '../../read-widget-layout';
import { WIDGET_LAYOUT_GLOBAL } from '../../widget.constants';
import type { LayoutWindow } from './useWidgetLayoutGlobal.type';

const useWidgetLayoutGlobal = (): void => {
  useEffect(() => {
    if (!isAutomationLaunch()) return undefined;
    const target = window as LayoutWindow;
    target[WIDGET_LAYOUT_GLOBAL] = readWidgetLayout;
    return () => { delete target[WIDGET_LAYOUT_GLOBAL]; };
  }, []);
};

export { useWidgetLayoutGlobal };
