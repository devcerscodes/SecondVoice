# Words

Words live in `brain.words`. Each word has a `box` from 1 to 5 and a `due` date. These are the intervals, the same as the app's Vault:

| box | next review |
|---|---|
| 1 | 1 day |
| 2 | 3 days |
| 3 | 7 days |
| 4 | 16 days |
| 5 | 35 days |

## Review

1. Take the words whose `due` is today or earlier, oldest first, at most 10.
2. For each word, give its meaning and a short situation, then ask for a sentence that uses the chunk:
   `Tamirci fiyat söyledi, pahalı geldi. Bunu "set back" ile söyle.`
   Recognising a word is easy. Producing it is the goal.
3. Judge the sentence:
   - Correct and natural: `box + 1`.
   - Understandable but the wrong form: keep the same box, and show the right form.
   - They didn't know it: back to box 1.
4. For every word you reviewed, set `due` from the new box and add 1 to `reps`.
5. If a word in box 5 is answered correctly again, set its `status` to `mastered`.

## Add

When the learner asks about a word or expression:

1. Explain it briefly:
   - the meaning
   - two examples
   - the register (casual, neutral or formal)
   - the trap for their native language, if there is one (see `traps` in `data.js`)
2. Offer to save it. Save the chunk with an example sentence and where it came from.

Then follow `coach/brain.md`.
