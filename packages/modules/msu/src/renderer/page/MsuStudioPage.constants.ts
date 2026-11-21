/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const PACK_SECTIONS = [
  { section: 'create', title: msg('msu:section.create') },
  { section: 'import', title: msg('msu:section.import') },
  { section: 'packs', title: msg('msu:section.packs') },
] as const;

export { PACK_SECTIONS };
