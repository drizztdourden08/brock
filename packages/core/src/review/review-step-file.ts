/* @layer core @kind logic */
const reviewStepFile = (index: number, step: string): string => {
  const slug = step.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'step';
  return `${String(index).padStart(2, '0')}-${slug}.png`;
};

export { reviewStepFile };
