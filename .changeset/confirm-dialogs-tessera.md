---
'@drizztdourden08/brock-react': patch
---

The confirm dialog is Tessera's `Dialog`, which starts a danger dialog on Cancel, keeps Tab inside and gives focus back; Brock's cancel-first dialog is gone. `confirmDelete({ what, consequence })` is unchanged.
