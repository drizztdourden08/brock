---
'@drizztdourden08/brock-randomizer': minor
---

The randomizer renderer gains the tracker and run UI that apps used to write themselves. `CheckToasts` announces a check found and an online room notice, and reads the registered game's tracker. `DeliveryQueueIndicator` lists the items waiting to be delivered, fed by the delivery queue through `useDeliveryQueue`. `ProfileRandomizerTab` shows a run's seed, type and connection facts and its options, changed or all, with the shared option rows. The core entry exports `randomSeed`, which returns 16 hex characters from the platform crypto. The wizard review summary is already covered by `randomizerReviewSections`.
