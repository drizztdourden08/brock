/* @layer renderer-components @kind component */
import { useState } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { PressedGrid } from '../../../compounds/PressedGrid';
import { Box, Card, Tabs, Text } from '@drizztdourden08/tessera/primitives';
import { BUTTONS_TITLE, NO_OTHER_INPUTS_NOTE, OTHER_INPUTS_NOTE, UNMAPPED_REASON } from '../ControllerPage.constants';
import type { BoxProps } from '../ControllerPage.type';
import { buttonModelOf } from '../behavior/button-model-of';
import { extrasModelOf } from '../behavior/extras-model-of';
import { BUTTON_TABS } from './ButtonsBox.constants';
import { ControllerRawBytes } from './ControllerRawBytes';
import { DebugLine } from './DebugLine';

const ButtonsBox = ({ page }: BoxProps) => {
  const text = useText();
  const { resolved, state, pad } = page;
  const [tab, setTab] = useState<string>(BUTTON_TABS[0].id);
  const buttons = buttonModelOf(resolved?.controls ?? [], state, page.overlay?.icons ?? {});
  const extras = extrasModelOf(pad.extras);

  return (
    <Card title={text(BUTTONS_TITLE)} className="controller-page__buttons">
      <Box className="controller-page__stack">
        <Tabs tabs={BUTTON_TABS} activeTab={tab} onTabChange={setTab} />
        {tab === 'raw' ? (
          <ControllerRawBytes state={state} />
        ) : (
          <Box className="controller-page__stack">
            {resolved
              ? <PressedGrid items={buttons.items} pressed={buttons.pressed} className="controller-page__pressed-grid" />
              : <Text className="controller-page__note">{text(UNMAPPED_REASON)}</Text>}
            <Text className="controller-page__note">{text(extras.items.length > 0 ? OTHER_INPUTS_NOTE : NO_OTHER_INPUTS_NOTE)}</Text>
            {extras.items.length > 0 && <PressedGrid items={extras.items} pressed={extras.pressed} />}
          </Box>
        )}
        <DebugLine state={state} />
      </Box>
    </Card>
  );
};

export { ButtonsBox };
