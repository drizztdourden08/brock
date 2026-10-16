/* @layer renderer-shell @kind component */
import { joinRoute } from '../../../../navigation/join-route';
import { ScreenStateScope } from '../../../../screens/screen-state-scope';
import { hubContent } from '../../behavior/hub-content';
import { hubScope } from '../../behavior/hub-scope';
import { HubPageFrame } from '../HubPageFrame';
import type { HubPageSlotProps } from './HubPageSlot.type';

const HubPageSlot = (props: HubPageSlotProps) => {
  const { context, onSelectTab, onUp } = props;
  const { hub, page, tab, sub } = context;
  return (
    <ScreenStateScope.Provider value={hubScope(context)}>
      <HubPageFrame key={`${page.id}/${sub?.id ?? ''}`} page={page} tab={tab} sub={sub} route={joinRoute(hub.id, page.id)} backdrop={page.backdrop ?? hub.backdrop} onSelectTab={onSelectTab} onUp={onUp}>
        {hubContent(context)}
      </HubPageFrame>
    </ScreenStateScope.Provider>
  );
};

export { HubPageSlot };
