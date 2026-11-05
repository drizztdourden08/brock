/* @layer renderer-shell @kind types */
import type { LobbyConnect, LobbyLocation } from '../../../lobby-setup';

interface ConnectModeProps {
  mode: LobbyConnect;
  location: LobbyLocation;
  onChange: (mode: LobbyConnect) => void;
  disabled: boolean;
}

export type { ConnectModeProps };
