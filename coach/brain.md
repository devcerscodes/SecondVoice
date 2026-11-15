# Brain and backlog

`learner/` is the learner's memory:

| File | What it holds | When it changes |
|---|---|---|
| `profile.json` | Who they are and how they want to be coached | Rarely |
| `brain.json` | What you know about their English | After every activity |
| `backlog.json` | What to practise next, built from the brain | After every activity |
| `journal/YYYY-MM-DD.md` | What happened, one file per day | After every activity |
| `reviews/YYYY-Www.md` | Weekly reviews | Once a week |

Empty versions of these files are in `learner.example/`. Keep their shapes: the app reads these files.

## After every activity

1. **Journal.** Append an entry to `learner/journal/<today>.md`:
   ```
   ## 14:20 · Role-play: At the GP (15 min)
   Mission: 2/3 · task 4, fluency 3, accuracy 3, natural 3
   Errors: article-missing ×3, tense-since ×1
   New words: set me back, run a temperature
   Note: Short turns, no follow-up questions. Try the party scene next.
   ```
2. **Errors.** For each mistake you corrected:
   - Find the matching pattern in `brain.errors` by `id`. Add 1 to `count`, set `last_seen`, and add the example to `examples`, keeping only the last 3.
   - If it's a new pattern, add it with `count: 1`.
   - Take `category` from the taxonomy below. Make the `id` specific: `article-missing`, not `grammar`.

   Set each pattern's `status`:
   - `active`: seen in the last 14 days.
   - `improving`: in the last 3 activities the structure came up and the learner got it right. Track this with `clean_streak`: add 1 when they get it right, reset it to 0 when the error appears.
   - `resolved`: `improving` for 3 weeks. Keep resolved patterns; never delete history.
3. **Words.** Add the "steal these" chunks to `brain.words`, with `box: 1`, `due` set to tomorrow, and a `source`. Skip duplicates.
4. **Scenes.** In `brain.scenes[<scene id>]`, add 1 to `times`, set `last`, and set `score` to the average of the four scores, rounded.
5. **Minutes.** Add the activity's minutes to `brain.areas.<area>.minutes`, using the area ids from `data.js`. Role-play, cue cards and free talk count as `speak`; drills count as the area of the pattern, usually `speak` or `write`. Levels change only in the weekly review.
6. **Streak.**
   - If `streak.last_day` is yesterday, add 1 to `current`.
   - If it's today, leave `current` as it is.
   - If it's older, set `current` to 1.

   Then set `last_day` to today.
7. **Sessions and date.** Add 1 to `brain.sessions` at most once a day, and set `brain.updated`. Set `brain.coach` to `{ "agent": "<your product name>", "last_seen": "<today>" }`, for example `"Claude Code"`, `"Codex"`, `"Gemini CLI"` or `"Cursor"`. The app's Connect page shows it. Never write an account, email or model id there.
8. **Backlog.** Rebuild it (below).

### Shapes

An error:
```json
{ "id": "article-missing", "category": "article", "pattern": "Drops 'the' before places and things both people know", "fix": "the airport, the doctor, the bill", "count": 3, "examples": ["I went to airport"], "first_seen": "2026-11-10", "last_seen": "2026-11-10", "clean_streak": 0, "status": "active" }
```

A word:
```json
{ "item": "set me back", "meaning": "cost me (informal)", "example": "How much will that set me back?", "source": "roleplay:garage", "added": "2026-11-10", "box": 1, "due": "2026-11-11", "reps": 0, "status": "learning" }
```

A scene:
```json
"gp": { "times": 1, "last": "2026-11-10", "score": 3 }
```

## Backlog

Rebuild `items` in `backlog.json` so that it has 8–12 `todo` items.
- Keep `done` and `skipped` items from the last 7 days as history, and drop older ones.
- Don't add an item that is already `todo`.
- Set `updated` to today.

Add items in this order:

1. **Fix a pattern** (priority 1). Each `active` error with `count` of 3 or more gets one targeted item. It is either a `drill` (`coach/today.md`), or a scene that forces the structure: since/for → `witness`, articles → `luggage`. Use `source: "error:<id>"`.
2. **Words due** (priority 1). Add one `words` item if any words are due, with `minutes: 10`.
3. **This week's plan** (priority 2). Add each item in `weeks[plan_week - 1].speak`, and the week's `write` task, that hasn't been done this week.
4. **Neglected area** (priority 2). For any area in `brain.areas` with no minutes in the last 7 days (check the journal), add an item. Shadowing, for example, becomes an app item with `ref: "#shadow"`.
5. **Comfort zone** (priority 3). Add one scene the learner has never done.
6. **Real people** (priority 3). Once a week, add a conversation with a tutor or language partner (`areas` → `people`).

An item:
```json
{ "id": "2026-11-10-1", "type": "roleplay", "title": "Role-play: At the GP", "why": "No health scene yet, and it's in week 2", "ref": "gp", "minutes": 15, "priority": 2, "source": "plan:w2", "status": "todo", "created": "2026-11-10" }
```

- `type` is one of: `roleplay`, `cuecard`, `freetalk`, `write`, `words`, `drill`, `shadow`, `input`, `read`, `people`.
- `ref` is a scene id, a cue card title, an error id (for a drill), or an app route such as `#shadow`.
- `why` is written for the learner: one short reason they would accept.

## Error taxonomy

Use these categories. The middle column is about Turkish speakers. For another native language, keep the categories that fit and add your own.

| category | why it happens (Turkish) | example |
|---|---|---|
| `article` | Turkish has no "the" | I went to ~~airport~~ the airport |
| `pronoun-gender` | Turkish "o" means he, she and it | my sister… ~~he~~ she |
| `subject-drop` | Turkish can leave out the subject | ~~Is raining.~~ It's raining. |
| `tense-aspect` | "-dır/-dir" pulls towards the present; past vs present perfect | ~~I'm living here since 2015~~ I've been living here since 2015 |
| `preposition` | Direct translation of Turkish case endings | depend ~~from~~ on, married ~~with~~ to |
| `verb-pattern` | Wrong structure around a verb | ~~discuss about it~~, ~~I am agree~~, ~~explain me~~ |
| `countable` | Different countability | ~~informations~~, ~~luggages~~, ~~an advice~~ |
| `question-form` | No inversion or auxiliary | ~~How much it costs?~~ How much does it cost? |
| `word-order` | Turkish is subject-object-verb | ~~I every day coffee drink~~ |
| `false-friend` | Similar-looking words | actual ≠ aktüel, sympathetic ≠ sempatik |
| `collocation` | Wrong partner word | ~~do~~ make a mistake, ~~make~~ do homework |
| `register` | Too direct, or too formal | ~~I want a coffee~~ Could I get a coffee? |
| `vocabulary` | Wrong or too general a word | very good → spot on, nice → lovely |
| `fluency` | One-word answers, no follow-up questions | "Yes." → "Yes, we moved here last year. You?" |
| `pronunciation` | Only when the learner reports it, or a dictation artefact clearly shows it | three → tree |

`traps` in `data.js` has more of these, with ready explanations in Turkish.
