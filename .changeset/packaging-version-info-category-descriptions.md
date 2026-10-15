---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

Packaging takes more from the product. The Windows exe gets its version info stamped beside the icon: company from `product.author`, product name and file description from `product.name`, `LegalCopyright` from the new `product.copyright` (else the year and the author), comments from `product.description`, and the app version. `product.linuxCategory` (a main freedesktop category such as `Game`) sets the deb's and the AppImage desktop entry's category, and the AppImage entry gets the description as its comment. A file association takes a `description`: the Linux mime comment, the Windows ProgId tooltip and electron-builder's association description.
