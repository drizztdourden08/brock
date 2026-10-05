/* @layer tooling-scripts @kind constants */
const WOFF2_SIGNATURE = 'wOF2';
const WOFF2_HEADER_SIZE = 48;
const CUSTOM_TAG = 63;
const COLLECTION_FLAVOR = 0x74746366;
const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT',
  'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH',
  'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar',
  'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
];

const GLYF_HEADER_SIZE = 36;
const GLYF_STREAMS = ['nContour', 'nPoints', 'flag', 'glyph', 'composite', 'bbox', 'instruction'];
const OVERLAP_SIMPLE_OPTION = 1;
const OVERLAP_SIMPLE_FLAG = 0x40;
const ON_CURVE_FLAG = 0x01;
const COMPOSITE_CONTOURS = -1;

const ARG_WORDS = 0x0001;
const HAS_SCALE = 0x0008;
const MORE_COMPONENTS = 0x0020;
const HAS_XY_SCALE = 0x0040;
const HAS_TWO_BY_TWO = 0x0080;
const HAS_INSTRUCTIONS = 0x0100;

const WORD_CODE = 253;
const ONE_MORE_BYTE_CODE_1 = 255;
const ONE_MORE_BYTE_CODE_2 = 254;
const LOWEST_U_CODE = 253;

const WINDOWS_PLATFORM = 3;
const FAMILY_NAME_IDS = [16, 1];

export {
  WOFF2_SIGNATURE, WOFF2_HEADER_SIZE, CUSTOM_TAG, COLLECTION_FLAVOR, KNOWN_TAGS, GLYF_HEADER_SIZE, GLYF_STREAMS, OVERLAP_SIMPLE_OPTION, OVERLAP_SIMPLE_FLAG,
  ON_CURVE_FLAG, COMPOSITE_CONTOURS, ARG_WORDS, HAS_SCALE, MORE_COMPONENTS, HAS_XY_SCALE, HAS_TWO_BY_TWO, HAS_INSTRUCTIONS, WORD_CODE,
  ONE_MORE_BYTE_CODE_1, ONE_MORE_BYTE_CODE_2, LOWEST_U_CODE, WINDOWS_PLATFORM, FAMILY_NAME_IDS,
};
