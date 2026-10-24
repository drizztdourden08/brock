/* @layer electron-main @kind logic */
import { entrySigned } from './entry-signed';
import { signRecent } from './sign-recent';

const recentSigned = entrySigned(signRecent);

export { recentSigned };
