/* @layer electron-main @kind logic */
import type { CatalogFailure } from '../catalog.type';
import { isSignedOut } from './is-signed-out';

const failureOf = (error: unknown): CatalogFailure => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error),
  signedOut: isSignedOut(error),
});

export { failureOf };
