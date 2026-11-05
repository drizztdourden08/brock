/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Box, Tabs } from '@drizztdourden08/tessera/primitives';
import { PointerHintProvider } from '../PointerHintProvider';
import type { CheatsFrameProps } from './CheatsFrame.type';
import './CheatsFrame.css';

const CheatsFrame = ({ tabs, activeTab, defaultTab, onTabChange, className = '' }: CheatsFrameProps) => {
  const [own, setOwn] = useState(defaultTab ?? tabs[0]?.id ?? '');
  const wanted = activeTab ?? own;
  const current = tabs.find((tab) => tab.id === wanted) ?? tabs[0];
  const change = (id: string) => { setOwn(id); onTabChange?.(id); };

  return (
    <PointerHintProvider>
      <Box className={`cheats-frame ${className}`.trim()}>
        <Tabs tabs={tabs.map(({ id, label }) => ({ id, label }))} activeTab={current?.id ?? ''} onTabChange={change} />
        <Box className="cheats-frame__content">{current?.content}</Box>
      </Box>
    </PointerHintProvider>
  );
};

export { CheatsFrame };
