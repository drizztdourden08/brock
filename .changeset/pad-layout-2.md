---
'@drizztdourden08/brock-input': patch
---

Pad callouts prefer the sides over the area below the pad at small sizes. A callout below the pad now costs more the further it sits from its button, and a layout that grows past the card height pays for each extra pixel, so the pad shrinks to leave room at the sides instead of growing a tall frame with long leaders under it. The layout tries a few pad sizes and keeps the cheapest. View, Menu and Share still prefer a spot above the highest button, with View first, then Menu, then Share, and the best arrangement of those three is chosen before the other callouts are placed. A short search moves a few crowded callouts together when that lowers the total cost. Meta buttons low on the pad, such as the SNES Select and Start, keep their nearest spot.
