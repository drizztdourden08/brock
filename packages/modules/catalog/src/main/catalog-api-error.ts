/* @layer electron-main @kind logic */
class CatalogApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CatalogApiError';
    this.status = status;
  }
}

export { CatalogApiError };
