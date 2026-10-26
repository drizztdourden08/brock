---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Search now finds a page by the keywords of its meta for every kind of page, and a page can declare rows of its own. A module settings page was left out of the index, and the hub page list dropped the keywords of a built-in page. Both are fixed. A new `searchRows` field in the page meta, a list of `{ label, keywords?, anchor? }`, adds one result per row: it opens the page and, with an anchor, scrolls to that element. `brock structure --check` now reports a `keywords` or `searchRows` value in a page meta that the build cannot read as a literal.
