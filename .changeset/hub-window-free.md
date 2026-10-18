---
'@drizztdourden08/brock-react': minor
---

Hub windows have no title row and can be moved and resized, positions saved per hub. A hub window uses Tessera's `titleRow={false}` and `movable`: the hub switch names the page, a round X sits on the top right corner, and a lock beside it frees the window to move and resize. Each hub keeps its own lock and position under `brock.hub.<hubId>`. Back and the profile tag now sit in the first row of the hub content. Plain screens keep their title row.
