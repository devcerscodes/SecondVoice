@AGENTS.md

## Claude Code

The coach playbooks are also slash commands: `/onboard`, `/today`, `/roleplay [scene]`, `/write`, `/words`, `/weekly`, `/wrap`. (`/start` and `/review` are taken by Claude Code itself, so those two have other names; typing "start" or "weekly review" in plain words works too.). They live in `.claude/skills/` and only point at `coach/*.md`. Keep the real logic in `coach/`, so every agent behaves the same.
