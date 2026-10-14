---
'@drizztdourden08/brock-react': patch
---

An app submenu named like a Brock menu section joins that section. A card or page placed with `meta.menu: 'Advanced'` made a second Advanced beside Brock's own, and the review's menu walk, which picks the first item with a label, went into the app's one, failed to find a module entry such as Controllers and left the menu open, so Escape closed the menu and the screen check failed (`<screen>-escape`). The app's entries now join the section, and the review closes the menu when a menu path it walks is not there.
