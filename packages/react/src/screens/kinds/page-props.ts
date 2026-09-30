/* @layer renderer-shell @kind logic */
import type { HubRenderContext } from '../../hub/hub.type';
import { nav } from '../../navigation/nav';
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
});

export { pageProps };
