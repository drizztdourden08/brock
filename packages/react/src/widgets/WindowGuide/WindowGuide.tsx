/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { WindowGuideOverlay } from '@drizztdourden08/tessera/composites';
import { useText } from '../../i18n';
import { useWindowGuide } from '../useWindowGuide';
import { GUIDE_HINTS } from './WindowGuide.constants';

const WindowGuide = () => {
  const guide = useWindowGuide();
  const text = useText();
  const hints = useMemo(() => GUIDE_HINTS[guide.mode].map((hint) => ({ ...hint, label: text(hint.label) })), [guide.mode, text]);
  return <WindowGuideOverlay open={guide.open} mode={guide.mode} snapping={guide.snapping} hints={hints} defaultHints={false} pointer={guide.pointer ?? null} />;
};

export { WindowGuide };
