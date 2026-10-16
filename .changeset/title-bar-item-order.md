---
"@drizztdourden08/brock-react": minor
"@drizztdourden08/brock-build": minor
---

Title bar items in the order an app chooses. A `src/title-bar/<id>.action.ts` file may export `order` (`export const order = 2`) or `meta: TitleBarItemMeta` with `order`, as screens do; `brock sync` carries it into `.brock/title-bar.ts`, and `titleBarFromFiles` puts the items with an order first, in that order, then the rest by id. Files without one keep the id order, so renaming files to order them is no longer needed.
