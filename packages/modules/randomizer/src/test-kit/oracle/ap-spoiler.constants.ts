/* @layer core @kind constants */
const BYTE_ORDER_MARK = 0xfeff;
const SECTION_HEADER = /^([A-Z][A-Za-z ]+):\s*$/;
const SPHERE_OPEN = /^\d+: \{$/;

export { BYTE_ORDER_MARK, SECTION_HEADER, SPHERE_OPEN };
