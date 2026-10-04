/* @layer renderer-shell @kind component */
import { WindowGuideOverlay } from '@drizztdourden08/tessera/composites';
import { useWindowGuide } from '../useWindowGuide';
import { GUIDE_HINTS } from './WindowGuide.constants';

const WindowGuide = () => {
  const guide = useWindowGuide();
  return <WindowGuideOverlay open={guide.open} mode={guide.mode} snapping={guide.snapping} hints={GUIDE_HINTS[guide.mode]} defaultHints={false} />;
};

export { WindowGuide };
