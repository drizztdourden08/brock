/* @layer electron-main @kind logic */
import type { OsIntegrationProduct } from './os-integration.type';
import { mimeTypeOf } from './mime-type-of';

const quoteExec = (path: string): string => `"${path.replace(/(["`$\\])/g, '\\$1')}"`;

const linuxDesktopEntry = (product: OsIntegrationProduct, exec: string): string => {
  const mimeTypes = [
    ...product.fileAssociations.map(mimeTypeOf),
    ...product.protocols.map(({ scheme }) => `x-scheme-handler/${scheme}`),
  ];
  return [
    '[Desktop Entry]',
    'Type=Application',
    `Name=${product.name.replace(/[\r\n]/g, ' ')}`,
    `Exec=${quoteExec(exec)} %U`,
    'Terminal=false',
    `MimeType=${mimeTypes.join(';')};`,
    `StartupWMClass=${product.id}`,
    '',
  ].join('\n');
};

export { linuxDesktopEntry };
