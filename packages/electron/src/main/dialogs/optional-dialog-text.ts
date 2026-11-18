/* @layer electron-main @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { dialogText } from './dialog-text';

const optionalDialogText = (value: Text | undefined): string | undefined => (value === undefined ? undefined : dialogText(value));

export { optionalDialogText };
