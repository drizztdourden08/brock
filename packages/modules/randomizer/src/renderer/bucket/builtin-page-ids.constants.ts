/* @layer renderer-shell @kind config */
import type { HubRenderContext } from '@drizztdourden08/brock-react';

const BUILTIN_PAGE_IDS: readonly string[] = ['run', 'options', 'network', 'online', 'logs', 'spoiler'];

const OVERRIDE_RENDER_CONTEXT = {} as HubRenderContext;

export { BUILTIN_PAGE_IDS, OVERRIDE_RENDER_CONTEXT };
