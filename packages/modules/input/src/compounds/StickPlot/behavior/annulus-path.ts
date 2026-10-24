/* @layer renderer-shell @kind logic */
const circlePath = (r: number): string => `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 Z`;

const annulusPath = (inner: number, outer: number): string => `${circlePath(outer)} ${circlePath(inner)}`;

export { annulusPath };
