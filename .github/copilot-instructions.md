# AIWorkshop — GitHub Copilot Instructions

Multi-framework workshop comparing implementation of the same subscription tracking app across SvelteKit, Go, Blazor, and React.

## Structure

```
AIWorkshop/
├── plans/
│   └── PLAN.md            ← Master plan: phased implementation (read first)
├── AGENTS.md              ← Project navigation & how to work here
├── subscription-app/
│   ├── AGENTS.md          ← Shared spec: data model, UI/UX, business logic
│   ├── sveltekit/         ← Reference implementation (build first, others match this)
│   │   └── AGENTS.md
│   ├── go/
│   │   └── AGENTS.md
│   ├── blazor/
│   │   └── AGENTS.md
│   └── react/
│       └── AGENTS.md
```

Each framework folder is self-contained with its own dependencies and build system.

## How to work here

1. Always read `subscription-app/AGENTS.md` first for the shared spec.
2. Then read the framework-specific `AGENTS.md` in that folder.
3. When in doubt about UI/UX, reference the **SvelteKit** code — it is the reference implementation.
4. All frameworks must produce the same visual output and share the same data model (SQLite + subscriptions table).

## Commands

Commands are framework-specific — each `AGENTS.md` lists its own setup and dev commands.

## Key facts

- SvelteKit is the reference — build it first, others match its UI/UX.
- All frameworks use SQLite, same schema, same color palette (#4F46E5 primary), same seed data.
- Add new frameworks by creating a new folder under `subscription-app/` with its own `AGENTS.md`.
