/* @layer renderer-app @kind constants */
import type { EventContract, InvokeContract, SendContract } from './contract.type';

const APP_INVOKE_MAP = {} as const satisfies Record<string, keyof InvokeContract>;

const APP_SEND_MAP = {} as const satisfies Record<string, keyof SendContract>;

const APP_EVENT_MAP = {} as const satisfies Record<string, keyof EventContract>;

export { APP_INVOKE_MAP, APP_SEND_MAP, APP_EVENT_MAP };
