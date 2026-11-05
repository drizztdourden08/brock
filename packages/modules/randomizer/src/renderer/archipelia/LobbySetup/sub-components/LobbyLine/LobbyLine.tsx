/* @layer renderer-shell @kind component */
import { Flex, Spinner, Status, Text } from '@drizztdourden08/tessera/primitives';
import type { LobbyLineProps } from './LobbyLine.type';

const LobbyLine = ({ state }: LobbyLineProps) => {
  if (state.kind === 'checking') return <Spinner size="sm" />;
  if (state.kind !== 'ok') return null;
  return (
    <Flex gap="sm" align="center" wrap>
      <Text weight={600}>{state.name}</Text>
      <Status tone="success" variant="pill">{`Archipelago ${state.ap}`}</Status>
      {state.open !== undefined && (
        <Status tone={state.open.free > 0 ? 'success' : 'neutral'} variant="pill">
          {`Open seats ${state.open.free}/${state.open.total}`}
        </Status>
      )}
      {state.approval && <Status tone="neutral" variant="pill">Host approval</Status>}
    </Flex>
  );
};

export { LobbyLine };
