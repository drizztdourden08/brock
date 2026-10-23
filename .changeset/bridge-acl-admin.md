---
'@drizztdourden08/brock-electron': patch
---

The bridge's Windows check on the discovery file now reads the owner and the access list by SID through `Get-Acl`, and trusts the user, SYSTEM and Administrators as owner and as allow entries. An administrator account, whose new files are owned by Administrators, was refused before, and the owner name match was fragile.
