/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { useText } from '../../../../i18n';
import { focusRegion } from '../../../../regions/focus-region';
import { SETTINGS_PREVIEW_LABEL, SETTINGS_ROWS_LABEL } from './SettingsPreviewLayout.constants';
import type { SettingsPreviewLayoutProps } from './SettingsPreviewLayout.type';
import './SettingsPreviewLayout.css';

const SettingsPreviewLayout = ({ preview, placement = 'end', label = SETTINGS_PREVIEW_LABEL, rowsLabel = SETTINGS_ROWS_LABEL, children }: SettingsPreviewLayoutProps) => {
  const text = useText();
  if (!preview) return <>{children}</>;
  return (
    <Box className="settings-preview-layout">
      <Box className={`settings-preview-layout__grid settings-preview-layout__grid--${placement}`}>
        <Box className="settings-preview-layout__preview" {...focusRegion('settings-preview', text(label), { role: 'complementary' })}>{preview}</Box>
        <Box className="settings-preview-layout__rows" {...focusRegion('settings-rows', text(rowsLabel))}>{children}</Box>
      </Box>
    </Box>
  );
};

export { SettingsPreviewLayout };
