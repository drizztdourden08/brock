/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { Flex, Spinner, Status, Text } from '@drizztdourden08/tessera/primitives';
import { HOST_APPROVAL_LABEL } from './LobbyLine.constants';
import type { LobbyLineProps } from './LobbyLine.type';

const LobbyLine = ({ state }: LobbyLineProps) => {
  const text = useText();
  if (state.kind === 'checking') return <Spinner size="sm" />;
  if (state.kind !== 'ok') return null;
  return (
    <Flex gap="sm" align="center" wrap>
      <Text weight={600}>{state.name}</Text>
      <Status tone="success" variant="pill">{text(msg('randomizer:lobby.line.version', { ap: state.ap }))}</Status>
      {state.open !== undefined && (
        <Status tone={state.open.free > 0 ? 'success' : 'neutral'} variant="pill">
          {text(msg('randomizer:lobby.line.openSeats', { free: state.open.free, total: state.open.total }))}
        </Status>
      )}
      {state.approval && <Status tone="neutral" variant="pill">{text(HOST_APPROVAL_LABEL)}</Status>}
    </Flex>
  );
};

export { LobbyLine };
