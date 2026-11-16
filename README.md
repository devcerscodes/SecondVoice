# Second Voice

A personal English coach that runs on the AI agent you already use. Second Voice has no API keys, no server and no subscription of its own.

It's built for B1–B2 learners who understand English well but freeze when they have to speak. The course content is tuned for Turkish speakers. Fork it for your own language.

## How it works

Second Voice has two parts.

- **The app** (`index.html`). A 12-week plan, a phrasebook, shadowing and sound pairs, flashcards and Turkish traps. It runs in the browser and needs no AI.
- **The coach** (`AGENTS.md` and `coach/`). Instructions that turn your AI agent (Claude Code, Codex, Gemini CLI, Cursor…) into an English coach. It role-plays real-life scenes, corrects your writing, quizzes you on your words and keeps track of how you're doing.

The coach remembers you through plain files in `learner/`:

| File | What it holds |
|---|---|
| `profile.json` | Your goals, your level and how you want to be corrected |
| `brain.json` | Your level per skill, your recurring mistakes, the words you're learning, the scenes you've done |
| `backlog.json` | What to practise next, rebuilt from the brain after every activity |
| `journal/` | One note per day |
| `reviews/` | One review per week |

`learner/` stays on your computer. It is git-ignored, so your progress never ends up in the repo.

## Quick start

1. Clone the repo, or fork it first:
   ```bash
   git clone https://github.com/devcerscodes/SecondVoice.git
   ```
2. Open your AI agent in the `SecondVoice` folder and say `start`. In Claude Code you can also run `/onboard`. The coach asks a few questions, takes a short baseline and builds your first plan.
3. Every day, say `today`. When you're done, say `wrap up`.
4. Optional: run the app with `npm run dev` and open http://localhost:5173. This needs Node.js (any recent version); nothing to install.

## Agents

| Agent | Reads | How to talk to it |
|---|---|---|
| Claude Code | `CLAUDE.md`, which imports `AGENTS.md` | `/onboard` `/today` `/roleplay gp` `/write` `/words` `/weekly` `/wrap`, or plain words |
| Codex, Cursor and other agents that read `AGENTS.md` | `AGENTS.md` | Just type: `today`, `roleplay gp`, `check my writing` |
| Gemini CLI | `GEMINI.md`, which points to `AGENTS.md` | Same as above |
| Anything else | Tell it: "Read AGENTS.md and follow it." | Same as above |

The coach costs whatever your agent's plan already costs. Second Voice adds nothing on top.

## Speaking without voice

Most agents are text-only. Say each line out loud, then type it or dictate it. Your mouth learns from the speaking; the coach only sees the text.

The coach can't hear your pronunciation. Train that in the app, on the Shadow & sounds page.

## Make it yours

The content is in `data.js`: scenes, phrasebook, cue cards, shadowing sets and traps.

If your native language isn't Turkish:
- Translate the explanations in `data.js`.
- Replace `traps` with the mistakes speakers of your language make.
- Set `explain_in` in `learner/profile.json`. The coach then explains in that language.
- Adapt the error taxonomy in `coach/brain.md`. Its middle column is about Turkish.

To add a role-play scene, add it to `scenarios` and `briefs` in `data.js`. Both the app and the coach pick it up.

## Layout

```
AGENTS.md            coach instructions, for every agent
CLAUDE.md            Claude Code entry point (imports AGENTS.md)
GEMINI.md            Gemini CLI entry point
coach/               playbooks: onboarding, today, speak, write, words, review, brain
.claude/skills/      Claude Code slash commands that point to coach/
learner.example/     empty learner files, copied to learner/ at start
index.html, app.js, styles.css, data.js    the app
```

## The app and the coach together

When you run the app locally, its Today page reads `learner/` and shows a **From your coach** card:
- the next items from your backlog, each with a line you can copy and paste into your agent
- the mistakes the coach is working on with you
- your coach streak and the words due

The app only reads these files; the coach writes them. Switch back to the browser tab after a session and the card updates.

Some app screens (the Word Lab lookup, Write feedback, the role-play chat) need AI. On claude.ai they use the page's own AI. Locally, `npm run dev` hands them to your agent: the server runs Claude Code, Codex or Gemini CLI in headless mode (`claude -p`, `codex exec`, `gemini -p`) with your existing login, and the page shows the answer. No API key needed.

- The first agent found wins, in that order. Pick one with `SV_AGENT=codex npm run dev`, and a model with `SV_MODEL=…`.
- The agent runs with no tools, in an empty temporary folder, so it can't read or change your files.
- Only this page can use it: the server listens on 127.0.0.1 and refuses requests from other sites.
- Each request uses your agent plan like any other prompt.

## License

Copyright (C) 2026 devcerscodes

Second Voice is free software under the [GNU Affero General Public License v3.0](LICENSE). Fork it, change it and use it for yourself. If you share a changed version, or run one as a website for others, you must publish your source code under the same license.
