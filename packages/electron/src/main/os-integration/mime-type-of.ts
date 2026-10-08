/* @layer electron-main @kind logic */
import type { FileAssociation } from '@drizztdourden08/brock-core/product';

const mimeTypeOf = ({ ext, mimeType }: Pick<FileAssociation, 'ext' | 'mimeType'>): string => mimeType ?? `application/x-${ext.toLowerCase()}`;

export { mimeTypeOf };
