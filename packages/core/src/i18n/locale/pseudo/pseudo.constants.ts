/* @layer core @kind constants */
const PSEUDO_ACCENTED = 'en-XA';

const PSEUDO_MIRRORED = 'ar-XB';

const PSEUDO_LOCALES: readonly string[] = [PSEUDO_ACCENTED, PSEUDO_MIRRORED];

const PSEUDO_GROWTH = 0.35;

const RTL_OPEN = '‫';

const RTL_CLOSE = '‬';

const ACCENTS: Readonly<Record<string, string>> = {
  A: 'Å', B: 'ß', C: 'Ç', D: 'Ð', E: 'É', G: 'Ĝ', I: 'Î', N: 'Ñ', O: 'Ö', S: 'Š', U: 'Ü', Y: 'Ý', Z: 'Ž',
  a: 'á', c: 'ç', d: 'ð', e: 'é', g: 'ĝ', i: 'î', n: 'ñ', o: 'ö', s: 'š', u: 'ü', y: 'ý', z: 'ž',
};

export { PSEUDO_ACCENTED, PSEUDO_MIRRORED, PSEUDO_LOCALES, PSEUDO_GROWTH, RTL_OPEN, RTL_CLOSE, ACCENTS };
