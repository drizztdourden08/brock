/* @layer electron-main @kind logic */
import { acceptedFiles } from './accepted-files';

const isAccepted = (file: string, stamp: string | null): boolean => stamp !== null && acceptedFiles.get(file) === stamp;

export { isAccepted };
