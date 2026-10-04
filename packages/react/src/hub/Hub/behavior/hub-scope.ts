/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../../navigation/join-route';
import type { HubRenderContext } from '../../hub.type';

const hubScope = (ctx: HubRenderContext): string => joinRoute(ctx.hub.id, ctx.page.id, ctx.sub?.id ?? ctx.tab?.id);

export { hubScope };
