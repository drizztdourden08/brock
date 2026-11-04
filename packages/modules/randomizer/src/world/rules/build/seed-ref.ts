/* @layer core @kind logic */
import type { SeedRef } from '../../types/seed-ref.type';

const seedRef = (key: string): SeedRef => ({ seed: key });

export { seedRef };
