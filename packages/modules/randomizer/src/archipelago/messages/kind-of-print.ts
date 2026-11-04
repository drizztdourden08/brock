/* @layer core @kind logic */
import { KIND_OF_TYPE } from './kind-of-print.constants';
import type { MessageKind } from './message-log.type';

const kindOfPrint = (type: string | undefined): MessageKind => KIND_OF_TYPE[type ?? ''] ?? 'server';

export { kindOfPrint };
