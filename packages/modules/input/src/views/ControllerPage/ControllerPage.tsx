/* @layer renderer-components @kind component */
import { Box, EmptyState } from '@drizztdourden08/tessera/primitives';
import { useControllerPage } from './behavior/useControllerPage';
import { GONE_MESSAGE } from './ControllerPage.constants';
import type { ControllerPageProps } from './ControllerPage.type';
import { AxesBox } from './sub-components/AxesBox';
import { ButtonsBox } from './sub-components/ButtonsBox';
import { InfoBox } from './sub-components/InfoBox';
import { PadBox } from './sub-components/PadBox';
import './ControllerPage.css';

const ControllerPage = ({ deviceKey, onRunDiagnostics }: ControllerPageProps) => {
  const page = useControllerPage(deviceKey);

  if (!page) return <EmptyState message={GONE_MESSAGE} />;

  return (
    <Box className="controller-page">
      <Box className="controller-page__grid">
        <PadBox page={page} />
        <AxesBox page={page} />
        <ButtonsBox page={page} />
        <InfoBox page={page} onRunDiagnostics={onRunDiagnostics} />
      </Box>
    </Box>
  );
};

export { ControllerPage };
