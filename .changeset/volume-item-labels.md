---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Breaking: a `volume` title bar item no longer takes `labels`, and brock-react no longer exports `TitleBarVolumeStrings`. Tessera's volume bar item draws the Mute and Unmute labels from its own strings, so an app that passed `labels` removes it. The `volume-item-labels` migration (0.59.0) leaves a to-do where `labels` sits in a file with a volume item, and on each use of `TitleBarVolumeStrings`.
