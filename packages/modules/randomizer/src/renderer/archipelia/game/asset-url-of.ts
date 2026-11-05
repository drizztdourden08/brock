/* @layer renderer-shell @kind logic */
import { archipeliaOf } from './archipelia-of';

const assetUrlOf = (path: string): string => archipeliaOf().archipelia.assetUrl?.(path) ?? path;

export { assetUrlOf };
