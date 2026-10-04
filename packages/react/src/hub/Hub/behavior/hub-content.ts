/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { HubRenderContext } from '../../hub.type';

const hubContent = (ctx: HubRenderContext): ReactNode => {
  if (ctx.sub) return ctx.sub.render(ctx);
  return ctx.tab ? ctx.tab.render(ctx) : ctx.page.render(ctx);
};

export { hubContent };
