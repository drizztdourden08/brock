/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import { EmptyState, Icon, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import type { LobbyRow } from '../../LobbySetup.type';
import { CLOSED_LABEL, NO_LOBBIES_HINT } from './LobbyRows.constants';
import type { LobbyRowsProps } from './LobbyRows.type';

const metaOf = (lobby: LobbyRow, text: (value: Text) => string): string => {
  if (!lobby.supported) return text(msg('randomizer:lobby.rows.noBuild', { address: lobby.address }));
  return [lobby.address, lobby.seats, lobby.open ? '' : text(CLOSED_LABEL)].filter((part) => part !== '').join(', ');
};

const LobbyRows = ({ lobbies, picked, onPick, disabled }: LobbyRowsProps) => {
  const text = useText();
  return (
    <Stack gap="2xs">
      {lobbies.length === 0 && <EmptyState message={text(NO_LOBBIES_HINT)} />}
      {lobbies.map((lobby) => {
        const joinable = lobby.open && lobby.supported;
        return (
          <ListItemRow
            key={lobby.id}
            className={joinable ? undefined : 'lobby-setup__row--closed'}
            icon={<Icon name="server" />}
            name={lobby.name}
            meta={metaOf(lobby, text)}
            selected={picked === lobby.id}
            onClick={disabled || !joinable ? undefined : () => onPick(lobby)}
            action={lobby.ap === undefined ? undefined : <Status tone={lobby.supported ? 'success' : 'warning'} variant="pill">{text(msg('randomizer:lobby.rows.version', { ap: lobby.ap }))}</Status>}
            actionVisibility="always"
          />
        );
      })}
    </Stack>
  );
};

export { LobbyRows };
