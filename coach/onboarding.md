# Onboarding

Goal: create `learner/` and a first backlog in about 10 minutes. Ask one or two questions at a time, in English. Switch to the learner's language if they struggle.

1. Copy `learner.example/` to `learner/`, all files, keeping their shapes. Set `profile.started` and `brain.updated` to today, and sign `brain.coach` with your product name (`coach/brain.md`, step 7).
2. Ask the following, and fill in `profile.json`:
   - name, native language, and the language explanations should be in
   - where they use English or will need it (job, moving abroad, an exam, travel)
   - what feels hardest right now
   - how many minutes a day they can really give (suggest 30–60)
   - British or American English as the model
   - corrections during conversation, or after (default: after)
   - three interests, for topics
3. Baseline, about 5 minutes:
   - Ask: "Introduce yourself and tell me about your last weekend. Say it out loud first, then type what you said. Aim for 8–10 sentences."
   - Then do a short role-play of 3–4 turns: the `party` scene from `scenarios`.
4. From the baseline:
   - Estimate a CEFR level per area in `brain.areas`. Be honest and write `"confidence": "low"`, because it is one sample. Leave `shadow` and `listen` empty: text can't show them.
   - Log every mistake that looks like a pattern in `brain.errors`, using the taxonomy in `coach/brain.md`.
   - Note one or two real strengths in `brain.strengths`.
5. Set `profile.plan_week` to 1, unless the learner says they have already started the plan.
6. Build the first backlog and write today's journal entry (`coach/brain.md`).
7. Tell them:
   - the level estimate, in one line
   - the two patterns you will work on first
   - what `today` will look like tomorrow
   - that the app (`npm run dev`, then http://localhost:5173) is where they do shadowing, sound pairs and flashcards
