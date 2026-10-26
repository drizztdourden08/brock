---
'@drizztdourden08/brock-build': minor
---

`defineBrockSite` takes `build.routes`, a list of `{ path, title, description? }`. After the Vite build, each route gets a copy of `dist/index.html` at `dist/<path>/index.html` with its own `<title>`, `<meta name="description">`, `og:title` and `og:description` (the Open Graph tags are changed only where the page already has them). Static hosts such as GitHub Pages serve `/privacy/` only when that file exists, so a single-page site no longer answers 404 on its legal pages. A path is letters, digits and dashes in segments split by `/`, with no leading or trailing slash and no dots; a bad or repeated path fails the build with a message naming the route. Title and description are escaped as HTML text. Asset URLs stay valid from the nested folder: absolute and base-prefixed URLs are kept, and a relative base (`./`) is rewritten to climb out of the folder. A site with no routes builds as before.
