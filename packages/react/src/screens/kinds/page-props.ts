/* @layer renderer-shell @kind logic */
import type { HubRenderContext } from '../../hub/hub.type';
import { joinRoute } from '../../navigation/join-route';
import { nav } from '../../navigation/nav';
import { fillSubPath } from '../conventions/fill-sub-path';
import type { BucketDef } from '../conventions/screens-config.type';
import type { PageProps } from './screen-kinds.type';

const pageProps = (bucket: BucketDef, ctx: HubRenderContext): PageProps => ({
  params: ctx.params,
  profile: ctx.profile,
  open: nav.open,
  close: ctx.close,
  bucket,
  page: ctx.page.id,
  tab: ctx.tab?.id ?? null,
  openSub: (sub, params = {}) => {
    const path = ctx.page.subs?.find((candidate) => candidate.id === sub)?.path ?? sub;
    nav.open(joinRoute(bucket.id, ctx.page.id, fillSubPath(path, params)));
  },
});

export { pageProps };
