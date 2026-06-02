# CLAUDE.md

Yacht Crew Marketplace — a two-sided Next.js + Prisma marketplace connecting yacht owners/captains with vetted crew (verified profiles, AI-assisted matching, tiered subscriptions). See `development-plan.md` for the product blueprint.

## Agent skills

### Issue tracker

Issues and PRDs live as **GitHub issues** in `miyagi420/ycrew-marketplace`, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

> Prerequisite: install the GitHub CLI (`gh`) and run `gh auth login` before the `gh`-based skills (`to-issues`, `triage`, `to-prd`) will work.

### Triage labels

Five canonical triage roles, using the default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
