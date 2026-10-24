/* @layer electron-main @kind logic */
import type { DocumentListOptions } from '@drizztdourden08/brock-core/platform';
import type { ListSettings } from './list-options.type';

const listOptions = (options: unknown): ListSettings => {
  const given = (typeof options === 'object' && options !== null ? options : {}) as Partial<DocumentListOptions>;
  const { extensions } = given;
  if (extensions !== undefined && (!Array.isArray(extensions) || extensions.some((ext) => typeof ext !== 'string'))) {
    throw new Error('The extensions of a document listing are a list of strings');
  }
  const wanted = (extensions ?? []).map((ext) => ext.replace(/^\./, '').toLowerCase());
  return { extensions: wanted.length === 0 ? null : new Set(wanted), recursive: given.recursive === true };
};

export { listOptions };
