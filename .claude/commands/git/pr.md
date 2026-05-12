---
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(gh pr create:*)
description: Create a GitHub PR to main by default, or to a specified branch (e.g. /git:pr feature-branch). Fills the project PR template automatically.
---

## Context

- Current branch: !`git branch --show-current`
- Commits vs main: !`git log main..HEAD --oneline`
- Diff stat: !`git diff main...HEAD --stat`
- PR template: !`cat .github/pull_request_template.md 2>/dev/null || echo "(no template)"`

## Task

Target branch: `$ARGUMENTS` if given, otherwise `main`.

1. Read the commits and diff to understand what changed and why.
2. Fill the PR template — check relevant boxes (`[x]`), write Korean prose where appropriate.
3. Write a concise English title in conventional commit style (≤72 chars).
4. Run `gh pr create --base <target> --title "<title>" --body "<body>"` and return the PR URL.
