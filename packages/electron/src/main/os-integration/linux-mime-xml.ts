/* @layer electron-main @kind logic */
import type { OsIntegrationProduct } from './os-integration.type';
import { mimeTypeOf } from './mime-type-of';

const escapeXml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const linuxMimeXml = (product: OsIntegrationProduct): string | null => {
  if (product.fileAssociations.length === 0) return null;
  const types = product.fileAssociations.map((association) => [
    `  <mime-type type="${escapeXml(mimeTypeOf(association))}">`,
    `    <comment>${escapeXml(association.name)}</comment>`,
    `    <glob pattern="*.${escapeXml(association.ext.toLowerCase())}"/>`,
    '  </mime-type>',
  ].join('\n'));
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">',
    ...types,
    '</mime-info>',
    '',
  ].join('\n');
};

export { linuxMimeXml };
