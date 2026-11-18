/* @layer electron-main @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { mainI18n } from '../i18n/main-i18n';

const dialogText = (value: Text): string => mainI18n().text(value);

const optionalDialogText = (value: Text | undefined): string | undefined => (value === undefined ? undefined : dialogText(value));

export { dialogText, optionalDialogText };
