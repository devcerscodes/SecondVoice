# Weekly review

Run it on Sundays, when the learner asks for it, or when `today` finds that the last review was 7 or more days ago.

1. Read the journal entries from the last 7 days, and `brain.json`.
2. Write `learner/reviews/YYYY-Www.md` with these sections:
   - **Time:** days practised, total minutes, which activities.
   - **Errors:** for each active pattern, this week's count against last week's. Which ones are improving, which are stuck, and any new ones.
   - **Words:** how many were added, reviewed and mastered.
   - **Plan:** which of this week's `goals` (`weeks[plan_week - 1]` in `data.js`) look done. Judge from the journal. For goals you can't see, such as "watched a series without subtitles", ask the learner.
   - **Next week:** the 2 patterns to target, 2 scenes to do, and one real-people task.
3. Decide on the plan week:
   - If most of the goals are done, move `profile.plan_week` forward.
   - If not, say so and keep the week, or offer a lighter version of it.
   - Don't move forward just because seven days have passed.
4. Change a level in `brain.areas` only if the week shows clear evidence, and write the reason in its `note`.
5. Rebuild the backlog with next week's focus, and set `brain.last_review` to today.
6. Tell the learner the review in 5 lines at most. End with one piece of encouragement that is specific and true.
