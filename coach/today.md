# Today

1. Read `learner/backlog.json`. Rebuild it first (`coach/brain.md`, Backlog section) if:
   - it has no `todo` items
   - its `updated` date is more than 3 days old
   - the last weekly review was 7 or more days ago. In that case, offer `coach/review.md` first.
2. Take the `todo` items, highest priority first, then oldest first. Pick items that fit `profile.minutes_per_day`:
   - at most 4 items
   - always at least one production item: `roleplay`, `cuecard`, `freetalk`, `write` or `drill`
3. Show the plan as a short numbered list, one line per item: title · minutes · why.
   `1. Role-play: At the GP · 15 min · no health scene yet, and it's in week 2`
   For items done in the app, add the link:
   `2. Shadowing: connected speech · 10 min · http://localhost:5173/#shadow`
4. Ask which one to start with, then run it with its playbook:
   - `roleplay`, `cuecard`, `freetalk` → `coach/speak.md`
   - `write` → `coach/write.md`
   - `words` → `coach/words.md`
   - `drill` → the drill below
5. After each item, set its `status` to `done`, or `skipped` if they skip it, and run the "after every activity" steps in `coach/brain.md`.
6. For app items, ask "done?" afterwards. Log them with the minutes they report.

If the learner missed days, don't scold. Say how long it's been and offer a lighter plan: one item, 15 minutes.

## Drill

A drill targets one error pattern from `brain.errors`, named in the item's `source`.

1. Show the pattern in one line, in the explanation language, with one example from the learner's own mistakes.
2. Give 6 short prompts that force the structure, one at a time. Mix the prompt types:
   - transform a sentence
   - translate from the learner's language
   - answer a question
3. Correct each answer right away. That's the point of a drill.
4. Finish with one open question where the structure comes up naturally. Check whether they use it without being told.
5. Log the result. If they got 5 or 6 right, plus the open question, count it as a chance the learner had and didn't make the error (`coach/brain.md`, Status).
