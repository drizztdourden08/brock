/* @layer renderer-shell @kind logic */
const splitChord = (chord: string): string[] => {
  const parts = chord.split('+').map((part) => part.trim()).filter(Boolean);
  return chord.trim().endsWith('+') ? [...parts, '+'] : parts;
};

export { splitChord };
