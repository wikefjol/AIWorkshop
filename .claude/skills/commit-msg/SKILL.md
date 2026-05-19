---
name: commit-msg
description: Generate a conventional commit message from staged files
---

## Goal

Read the staged files and produce a short, informative commit title and message following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Steps

1. Run `git diff --cached --name-only` to list all staged files.
2. Run `git diff --cached` to see the full content changes.
3. Analyze the changes to determine:
   - **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
   - **scope** (optional): the module, component, or file affected
   - **breaking**: whether the change introduces a breaking change (prefix type with `!`)
4. Write the commit message:
   - **Title**: `<type>[optional scope]: <description>` (max 72 chars)
     - Use imperative mood, lowercase after scope colon
     - Example: `feat(subscriptions): add delete endpoint`
   - **Body** (optional): 1-3 short lines explaining what and why, not how
     - Wrap at 72 characters
     - Separate from title with a blank line
5. Output the commit message in this format:

```
<type>[scope]: <title>

<body>
```

## Guidelines

- Prefer specific types: `feat` for new features, `fix` for bug fixes, `refactor` for code restructuring without behavior change.
- Keep the title concise — it should summarize the change at a glance.
- The body should explain the motivation behind the change.
- If multiple unrelated changes are staged, suggest splitting into separate commits.
- For monorepo or multi-framework projects (like AIWorkshop), include the framework/module as scope: `feat(sveltekit): ...` or `chore(go): ...`.
