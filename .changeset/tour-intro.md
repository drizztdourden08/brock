---
'@drizztdourden08/brock-react': minor
---

Pass the tour intro panel through to Tessera. A tour step gains `intro`, `art` and `reveal`, with the meaning they have on a Tessera guided step: `intro: true` draws the wide welcome panel, `art` is its picture and `reveal` runs before Tessera looks for a target that is not drawn yet. A `.tour.ts` file has no JSX, so `art` also accepts the token `'product-mark'`, which Brock turns into the product mark (the brand mark, else the product logo), and `{ icon: '<name>' }`, which becomes a Tessera icon. A `ReactNode` still works in a `.tour.tsx` file. A step without these fields is unchanged.
