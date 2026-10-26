/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { SettingsPreviewLayoutProps } from './SettingsPreviewLayout.type';
import './SettingsPreviewLayout.css';

const SettingsPreviewLayout = ({ preview, placement = 'end', children }: SettingsPreviewLayoutProps) => {
  if (!preview) return <>{children}</>;
  return (
    <Box className="settings-preview-layout">
      <Box className={`settings-preview-layout__grid settings-preview-layout__grid--${placement}`}>
        <Box className="settings-preview-layout__preview">{preview}</Box>
        <Box className="settings-preview-layout__rows">{children}</Box>
      </Box>
    </Box>
  );
};

export { SettingsPreviewLayout };
