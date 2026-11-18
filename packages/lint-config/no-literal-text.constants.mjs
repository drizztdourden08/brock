/* @layer tooling-scripts @kind constants */
const LITERAL_TEXT_MESSAGE = 'User-visible text "{{text}}" is a literal. Put it in the locale table and use msg(\'ns:key\').';
const DEFAULT_ATTRIBUTES = Object.freeze(['title', 'label', 'placeholder', 'aria-label', 'alt', 'description', 'tooltip']);
const DEFAULT_PROPERTIES = Object.freeze(['label', 'title', 'description', 'placeholder', 'keywords']);
const MESSAGE_FUNCTION = 'msg';
const HAS_LETTER = /\p{L}/u;
const TEST_FILE = /(?:\.(?:test|spec|stories)\.[cm]?[jt]sx?$)|(?:(?:^|[\\/])(?:tests?|__tests__)[\\/])/;
const PROPERTY_FILE = '(^|[\\\\/])src[\\\\/](?!main[\\\\/]|preload[\\\\/])';
const TEXT_PREVIEW_LENGTH = 40;

export { DEFAULT_ATTRIBUTES, DEFAULT_PROPERTIES, HAS_LETTER, LITERAL_TEXT_MESSAGE, MESSAGE_FUNCTION, PROPERTY_FILE, TEST_FILE, TEXT_PREVIEW_LENGTH };
