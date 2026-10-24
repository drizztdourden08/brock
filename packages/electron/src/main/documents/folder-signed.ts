/* @layer electron-main @kind logic */
import { entrySigned } from './entry-signed';
import { signFolder } from './sign-folder';

const folderSigned = entrySigned(signFolder);

export { folderSigned };
