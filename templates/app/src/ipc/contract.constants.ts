/* @layer renderer-app @kind constants */
import { defineChannels } from '@drizztdourden08/brock-core';

const APP_CHANNELS = defineChannels({});

const APP_INVOKE_MAP = APP_CHANNELS.maps.invoke;

const APP_SEND_MAP = APP_CHANNELS.maps.send;

const APP_EVENT_MAP = APP_CHANNELS.maps.events;

export { APP_CHANNELS, APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
