/* @layer core @kind constants */
import { asPacketHandler } from './as-packet-handler';
import { onBounced } from './on-bounced';
import { onConnected } from './on-connected';
import { onDataPackage } from './on-data-package';
import { onInvalid } from './on-invalid';
import { onLocationInfo } from './on-location-info';
import { onPrintJson } from './on-print-json';
import { onReceivedItems } from './on-received';
import { onRefused } from './on-refused';
import { onRoomInfo } from './on-room-info';
import { onRoomUpdate } from './on-room-update';
import type { PacketHandlers } from './packet-handlers.type';

const PACKET_HANDLERS: PacketHandlers = {
  RoomInfo: asPacketHandler(onRoomInfo),
  DataPackage: asPacketHandler(onDataPackage),
  Connected: asPacketHandler(onConnected),
  ConnectionRefused: asPacketHandler(onRefused),
  ReceivedItems: asPacketHandler(onReceivedItems),
  LocationInfo: asPacketHandler(onLocationInfo),
  RoomUpdate: asPacketHandler(onRoomUpdate),
  PrintJSON: asPacketHandler(onPrintJson),
  Bounced: asPacketHandler(onBounced),
  InvalidPacket: asPacketHandler(onInvalid),
};

export { PACKET_HANDLERS };
