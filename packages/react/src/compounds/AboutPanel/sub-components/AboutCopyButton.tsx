/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { useCopyText } from '../../../hooks/useCopyText';
import { ABOUT_PANEL_TEXT } from '../AboutPanel.constants';
import type { AboutCopyButtonProps } from './AboutCopyButton.type';

const AboutCopyButton = (props: AboutCopyButtonProps) => {
  const { text, label = ABOUT_PANEL_TEXT.copy } = props;
  const { copied, copy } = useCopyText();

  return (
    <Button variant="secondary" className="about-panel__copy" onClick={() => void (text !== null && copy(text))} loading={text === null}>
      {copied ? ABOUT_PANEL_TEXT.copied : label}
    </Button>
  );
};

export { AboutCopyButton };
