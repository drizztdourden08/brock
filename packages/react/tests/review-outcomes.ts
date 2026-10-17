/* @layer renderer-shell @kind test */
import type { ReviewOutcome } from '../src/review/review.type';

const failed = (outcomes: readonly ReviewOutcome[]): string[] => outcomes.filter((o) => !o.pass).map((o) => o.id);
const reasonOf = (outcomes: readonly ReviewOutcome[], id: string): string | undefined => outcomes.find((o) => o.id === id)?.reason;

export { failed, reasonOf };
