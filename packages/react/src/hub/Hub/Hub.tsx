/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { liveEntriesOf } from './behavior/live-entries';
import { HubBody } from './sub-components/HubBody';
import { HubLiveSources } from './sub-components/HubLiveSources';
import type { HubProps } from './Hub.type';
import './Hub.css';

const Hub = (props: HubProps) => {
  const { def } = props;
  const sources = useMemo(() => liveEntriesOf(def), [def]);
  return <HubLiveSources sources={sources}>{(live) => <HubBody {...props} live={live} />}</HubLiveSources>;
};

export { Hub };
