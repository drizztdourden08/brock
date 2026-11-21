---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-randomizer': minor
---

The Report a bug palette action, the randomizer wizard steps and their option sub-steps, the activity kind labels, the Checks view, the Run activity card and the Logs view take a `Text`, so apps can translate them. A profile wizard step's `label`, `description`, `summary` and `subSteps` labels are `Text` (`ProfileWizardSubStep` is exported), and `placeWizardSteps` takes a `text` resolver as its third argument. `TrackerGrouping.label` and `description`, and `RandomizerLabels.kinds`, are `Text`.
