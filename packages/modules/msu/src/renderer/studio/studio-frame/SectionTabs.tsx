/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Tabs } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { studioTabs } from '../sound-labels';
import type { SectionTabsProps } from './studio-frame.type';

const SectionTabs = (props: SectionTabsProps) => {
  const { tab, onTabChange } = props;
  const game = useMsuStudioGame<never, never>();
  const items = useMemo(() => studioTabs(game), [game]);

  return <Tabs tabs={items} activeTab={tab} onTabChange={onTabChange} />;
};

export { SectionTabs };
