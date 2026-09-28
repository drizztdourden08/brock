/* @layer renderer-shell @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { ConfirmIconButton } from '@drizztdourden08/tessera/composites';
import { AT_DEFAULTS_LABEL, RESET_LABEL } from './SectionHeading.constants';
import type { SectionHeadingProps } from './SectionHeading.type';

const SectionHeading = (props: SectionHeadingProps) => {
  const { title, changedCount, onReset } = props;
  const resettable = changedCount > 0;

  return (
    <Box className="settings-layout__section-heading">
      <Text as="h2" className="settings-layout__section-title">{title}</Text>
      <ConfirmIconButton
        className="settings-layout__section-reset"
        icon={<Icon name="rotate-ccw" size={13} />}
        label={resettable ? `${RESET_LABEL} (${changedCount} changed)` : AT_DEFAULTS_LABEL}
        confirmLabel="Reset to defaults"
        cancelLabel="Keep current settings"
        disabled={!resettable}
        onConfirm={onReset}
      />
    </Box>
  );
};

export { SectionHeading };
