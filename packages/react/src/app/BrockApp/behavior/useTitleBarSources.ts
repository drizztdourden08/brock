/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { JOB_BAR_ID } from '../../../jobs/jobs.constants';
import { useJobTitleBarAction } from '../../../jobs/useJobTitleBarAction';
import type { TitleBarActionSource } from '../../../modules/renderer-module.type';
import { STANDARD_TITLE_BAR_ACTIONS } from '../../../overlays/standard-title-bar-actions.constants';
import { appTitleBarSources } from '../../../title-bar/app-title-bar-sources';
import type { TitleBarItemEntry } from '../../../title-bar/title-bar-item.type';

const useTitleBarSources = (moduleSources: readonly TitleBarActionSource[], appItems: readonly TitleBarItemEntry[]): TitleBarActionSource[] =>
  useMemo(() => {
    const fixed: TitleBarActionSource[] = [...STANDARD_TITLE_BAR_ACTIONS, useJobTitleBarAction, ...moduleSources];
    const taken = [JOB_BAR_ID, ...fixed.flatMap((source) => (typeof source === 'function' ? [] : [source.id]))];
    return [...fixed, ...appTitleBarSources(appItems, taken)];
  }, [moduleSources, appItems]);

export { useTitleBarSources };
