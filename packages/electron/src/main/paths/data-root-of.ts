/* @layer electron-main @kind logic */
import { join } from 'path';

const dataRootOf = (userDataDir: string): string => join(userDataDir, 'Data');

export { dataRootOf };
