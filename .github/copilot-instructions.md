# AIWorkshop — GitHub Copilot Instructions

When generating commit messages, follow the Conventional Commits specification (https://www.conventionalcommits.org/en/v1.0.0/).

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]
```

## Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation changes
- `style` — code style changes (formatting, semicolons, etc.)
- `refactor` — code refactoring
- `perf` — performance improvements
- `test` — test additions or changes
- `build` — build system or dependency changes
- `ci` — CI configuration changes
- `chore` — maintenance tasks
- `revert` — reverting previous commits

## Guidelines

- Use imperative mood in the description ("add" not "added")
- Keep the title under 72 characters
- Use lowercase after the type/scope colon
- Include scope for multi-framework projects (e.g., `feat(sveltekit):`, `chore(go):`)
- Add `!` before colon for breaking changes (e.g., `feat!: breaking API change`)
- If multiple unrelated changes are staged, suggest splitting into separate commits
