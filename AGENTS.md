# AGENTS.md

- Preserve the branch chain: `main -> step-1 -> ... -> step-23`.
- For project-wide changes, commit first on `step-1`, then merge upward one branch at a time through `step-23`.
- For step-specific changes, commit on the earliest affected step branch, then merge upward sequentially through `step-23`.
- Do not apply the same change independently to multiple step branches.
- After propagation, verify adjacent ancestry with `git merge-base --is-ancestor step-N step-(N+1)`.
