/* @layer renderer-shell @kind component */
import { Box, Icon, IconButton, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { useBackTarget } from '../../../../navigation/useBackTarget';
import { useNavigation } from '../../../../navigation/useNavigation';
import { ScreenSubtitle } from '../../../../shell/ScreenSubtitle';
import { hubBackLabel } from '../../../back-label-of';
import type { HubBarProps } from './HubBar.type';
import './HubBar.css';

const HubBar = ({ def }: HubBarProps) => {
  const target = useBackTarget();
  const { back } = useNavigation();
  const { navigation } = useTesseraStrings();
  return (
    <Box className="hub__bar">
      {target !== null && (
        <IconButton variant="ghost" size="md" label={navigation.backTo(hubBackLabel(def, target))} className="hub__back" onClick={back}>
          <Icon name="arrow-left" size={18} />
        </IconButton>
      )}
      <Box className="hub__bar-subtitle"><ScreenSubtitle /></Box>
    </Box>
  );
};

export { HubBar };
