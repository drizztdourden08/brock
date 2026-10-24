/* @layer electron-main @kind barrel */
export { connectBridge } from '../main/bridge/connect-bridge';
export { readBridgeDiscovery } from '../main/bridge/read-bridge-discovery';
export { bridgeDiscoveryFile } from '../main/bridge/bridge-discovery-file';
export { startBridgeServer } from '../main/bridge/start-bridge-server';
export { writeBridgeDiscovery } from '../main/bridge/write-bridge-discovery';
export { readAppLaunch } from '../main/bridge/read-app-launch';
export { startApp } from '../main/bridge/start-app';
export { BridgeError } from '../main/bridge/bridge-error';
export { BRIDGE_CODES, BRIDGE_FILE_ENV, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_PROTOCOL } from '../main/bridge/bridge.constants';
export type { BridgeClient, BridgeClientOptions } from '../main/bridge/bridge-client.type';
export type { AppLaunch, ReadAppLaunchOptions } from '../main/bridge/app-launch.type';
export type {
  BridgeArgsCheck, BridgeCall, BridgeCallHandler, BridgeDiscovery, BridgeErrorOptions, BridgeEvent, BridgeHandler, BridgeReply, BridgeRequest, BridgeRoute,
  BridgeRouteOptions, BridgeServer, BridgeServerOptions,
} from '../main/bridge/bridge.type';
