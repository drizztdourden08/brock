/* @layer renderer-shell @kind component */
import { Button, ButtonRow, Center, EmptyState, Icon, Span, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { LOGS_WIDGET_ID } from '../../widgets/built-in/LogsWidget/LogsWidget.constants';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { useBootStore } from '../useBootStore';
import { failureTitle } from './behavior/failure-title';
import type { BootFailureGateProps } from './BootFailureGate.type';
import './BootFailureGate.css';

const retry = (): void => window.location.reload();

const openLogs = (): void => useWidgetLayoutStore.getState().open(LOGS_WIDGET_ID);

const BootFailureGate = (props: BootFailureGateProps) => {
  const { children } = props;
  const failure = useBootStore((s) => (s.phase === 'failed' ? s.failure : null));
  if (failure === null) return children;
  const message = (
    <Stack gap="xs" align="center">
      <Text as="h2" className="boot-failure__title">{failureTitle(failure)}</Text>
      <Span tone="muted" className="boot-failure__detail">{failure.message}</Span>
    </Stack>
  );
  const actions = (
    <ButtonRow align="center">
      <Button variant="primary" icon={<Icon name="refresh-cw" />} onClick={retry}>Retry</Button>
      <Button variant="secondary" icon={<Icon name="file-text" />} onClick={openLogs}>Open logs</Button>
    </ButtonRow>
  );
  return (
    <Center className="boot-failure" role="alert">
      <EmptyState icon={<Icon name="triangle-alert" size={32} />} message={message} action={actions} />
    </Center>
  );
};

export { BootFailureGate };
