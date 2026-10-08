---
'@drizztdourden08/brock-build': patch
---

The `.deb` builds without an app's own metadata: the builder config sets `homepage` from `product.repo` (`https://github.com/<owner>/<name>`), the maintainer as `Name <email>` from `product.author`, the vendor, and the synopsis and description from `product.description`.
