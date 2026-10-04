/* @layer electron-main @kind logic */
import type { ChannelArg } from './handle.type';

const channelName = <K extends PropertyKey>(channel: ChannelArg<K>): string => String(typeof channel === 'object' ? channel.channel : channel);

export { channelName };
