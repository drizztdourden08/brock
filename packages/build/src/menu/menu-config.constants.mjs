/* @layer tooling-scripts @kind constants */
const MENU_GROUPS = ['main', 'sections', 'modules', 'end'];

/** @type {Record<string, { valid: (value: unknown) => boolean, wants: string }>} */
const MENU_FIELDS = {
  hidden: { valid: (value) => typeof value === 'boolean', wants: 'true or false' },
  label: { valid: (value) => typeof value === 'string' && value.trim() !== '', wants: 'a non-empty text' },
  group: { valid: (value) => typeof value === 'string' && MENU_GROUPS.includes(value), wants: MENU_GROUPS.map((id) => `'${id}'`).join(', ') },
  order: { valid: (value) => typeof value === 'number' && Number.isFinite(value), wants: 'a number' },
  before: { valid: (value) => typeof value === 'string' && value !== '', wants: 'an entry key' },
  after: { valid: (value) => typeof value === 'string' && value !== '', wants: 'an entry key' },
  parent: { valid: (value) => value === null || (typeof value === 'string' && value !== ''), wants: 'a submenu key, or null for the top level' },
};

const BUCKET_KEY_PREFIX = 'bucket:';
const SCREEN_KEY_PREFIX = 'screen:';
const PAGE_KINDS = ['hero', 'page', 'custom', 'settings', 'page-meta'];
const CARD_KINDS = ['card', 'layer'];
const VIEW_KEY = 'view';
const MENU_CONFIG_PATH = 'brock.config.ts product.menu';

export { BUCKET_KEY_PREFIX, CARD_KINDS, MENU_CONFIG_PATH, MENU_FIELDS, PAGE_KINDS, SCREEN_KEY_PREFIX, VIEW_KEY };
