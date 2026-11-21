/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { Tabs } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { studioTabs } from '../sound-labels';
import type { SectionTabsProps } from './studio-frame.type';

const SectionTabs = (props: SectionTabsProps) => {
  const { tab, onTabChange } = props;
  const game = useMsuStudioGame<never, never>();
  const text = useText();
  const items = useMemo(() => studioTabs(game, text), [game, text]);

  return <Tabs tabs={items} activeTab={tab} onTabChange={onTabChange} />;
};

export { SectionTabs };
