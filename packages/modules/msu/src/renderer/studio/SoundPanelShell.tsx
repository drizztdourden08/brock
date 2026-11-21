/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { StudioLayout } from '@drizztdourden08/tessera/composites';
import { STUDIO_EDITOR_MIN_WIDTH, StudioPanelContent } from '../studio-kit';
import { SoundListHeader } from './SoundListHeader';
import { detailsPanel } from './studio-frame/details-panel';
import type { SoundPanelShellProps } from './SoundPanelShell.type';
import './SoundPanelShell.css';

const SoundPanelShell = (props: SoundPanelShellProps) => {
  const { editorLabel, toolbar, detail, header, children } = props;
  const text = useText();

  return (
    <StudioLayout
      editorLabel={editorLabel}
      compactToolbar
      editorMinWidth={STUDIO_EDITOR_MIN_WIDTH}
      toolbar={toolbar}
      end={detailsPanel(text, <StudioPanelContent>{detail}</StudioPanelContent>)}
    >
      <Box className="msu-panel">
        <SoundListHeader {...header} />
        {children}
      </Box>
    </StudioLayout>
  );
};

export { SoundPanelShell };
