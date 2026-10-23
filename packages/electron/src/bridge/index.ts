/* @layer electron-main @kind barrel */
export { connectBridge } from '../main/bridge/connect-bridge';
export { readBridgeDiscovery } from '../main/bridge/read-bridge-discovery';
export { bridgeDiscoveryFile } from '../main/bridge/bridge-discovery-file';
export { startBridgeServer } from '../main/bridge/start-bridge-server';
export { BRIDGE_FILE_ENV, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_PROTOCOL } from '../main/bridge/bridge.constants';
export type {
  BridgeClient, BridgeClientOptions, BridgeDiscovery, BridgeHandler, BridgeReply, BridgeRequest, BridgeRoute, BridgeServer, BridgeServerOptions,
} from '../main/bridge/bridge.type';
