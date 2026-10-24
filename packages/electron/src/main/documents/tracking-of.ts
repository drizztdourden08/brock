/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { DocumentAccess } from './document-access.type';
import { createDocumentTracking } from './document-tracking';
import type { DocumentTracking } from './document-tracking.type';

const trackings = new WeakMap<DocumentAccess, DocumentTracking>();

const trackingOf = (ctx: Pick<MainContext, 'paths' | 'documents' | 'log' | 'profiles'>): DocumentTracking => {
  const existing = trackings.get(ctx.documents);
  if (existing !== undefined) return existing;
  const created = createDocumentTracking(ctx);
  trackings.set(ctx.documents, created);
  return created;
};

export { trackingOf };
