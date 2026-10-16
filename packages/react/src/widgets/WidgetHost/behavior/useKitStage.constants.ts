/* @layer renderer-shell @kind constants */
import type { ReactNode } from 'react';
import type { KitStatus } from '../../kits/widget-kit.type';

const NO_CONTENT: Record<string, ReactNode> = {};

const OPEN_STATUS: KitStatus = { shown: true, reason: null };

export { NO_CONTENT, OPEN_STATUS };
