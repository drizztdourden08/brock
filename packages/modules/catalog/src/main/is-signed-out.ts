/* @layer electron-main @kind logic */
import { CatalogApiError } from './catalog-api-error';
import { UNAUTHORIZED } from './catalog-main.constants';

const isSignedOut = (error: unknown): boolean => error instanceof CatalogApiError && error.status === UNAUTHORIZED;

export { isSignedOut };
