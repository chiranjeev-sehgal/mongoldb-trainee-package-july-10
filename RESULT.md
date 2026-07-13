# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Shreya Tyagi
- Trainee ID: Shreya Tyagi (Batch A; no separate ID field provided)
- Database Track: MongoDB
- Branch: DF9-P3K-W8C
- Final Commit: 57952ea6d499dc7f17cfb40ce609af3025f21abf

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not installed, so `npm run test:visible`, `typecheck`, `lint`, and `build` were not executed.
  - Runtime MongoDB verification was unavailable; assessment relies on static code review against expected behavior and the trainee’s git diff from base commit `aa5b7ec`.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`.
- What is correct:
  - Nothing related to this planted defect was fixed.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal errors still expose `details` (raw `error.message`) to clients, which can leak connection or driver diagnostics.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: default `handler` returns status `400` for non-GET/POST methods (lines 101–108) and includes unsanitized `details` on 500 responses (lines 117–127).
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - Changed overdue `dueDate` filter from `$gt` to `$lt`.
  - Added `status: { $nin: ['resolved', 'closed'] }` so only active overdue tickets are returned.
  - Added a visible test asserting invalid priority returns 400.
- What is correct:
  - Overdue cutoff now correctly uses due dates before current time (`getControlledNow()`).
  - Resolved and closed tickets are excluded.
  - Optional priority filtering via `validatePriority` remains in place and invalid priorities correctly surface as validation errors.
- What is incomplete or incorrect:
  - Ordering still uses MongoDB lexical `.sort({ priority: 1, dueDate: 1 })`, which yields alphabetical priority order (`critical`, `high`, `low`, `medium`), not the required business order (`critical`, `high`, `medium`, `low`).
  - Existing helpers in `lib/priority.ts` (`priorityWeight` / `comparePriorities`) were not used; no aggregation-based rank or application-side business sort was added.
  - Intentional-defect comment about business priority order remains unaddressed in code behavior.
- Evidence:
  - file: `pages/api/tickets/overdue.ts`
  - relevant function or logic: filter construction (`dueDate: { $lt: now }`, `status.$nin`) is correct; `.sort({ priority: 1, dueDate: 1 })` does not implement business priority ranking.
- Submission.md consistency: Partially Accurate
  - Correctly claims overdue filtering was broken and fixed; does not mention or acknowledge the remaining priority-ordering defect.

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - Replaced defective priority `$sum` conditioned on `assignedTo` with `$sum: 1`.
- What is correct:
  - Priority aggregation now counts documents rather than assigned tickets only.
  - Total count, status grouping via `$sum: 1`, and `overdueActive` filtering (`dueDate < now` and status not in resolved/closed) are correct for the intended business rules.
  - No hardcoded fixture totals were introduced.
- What is incomplete or incorrect:
  - Zero normalization is still missing: `byStatus` and `byPriority` are built only from present `$group` keys (`Partial<Record<...>>`), so absent statuses/priorities are omitted instead of returned as `0`.
  - The intentional-defect comment about absent categories not being normalized remains accurate about current behavior.
- Evidence:
  - file: `pages/api/tickets/statistics.ts`
  - relevant function or logic: priority `$group` now uses `count: { $sum: 1 }` (fixed); reduce accumulators for `byStatus` / `byPriority` still lack zero-filled seed objects for all expected keys.
- Submission.md consistency: Partially Accurate
  - Correctly identifies incorrect priority aggregation and the `$sum` fix matches code; does not mention zero-key normalization.

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` missing)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed:
  - Added one test in `tests/visible/overdue.test.ts` for invalid priority → 400.
  - No changes to `tickets.test.ts` or `statistics.test.ts`.
  - Modified `jest.config.js` roots to drop `instructor/hidden-tests` so local visible tests can run without a missing directory.
- Quality of tests:
  - The added invalid-priority assertion is valid and aligned with existing validation behavior.
  - It does not cover business priority ordering or statistics zero-normalization, so remaining gaps can still pass the current visible suite when the fixture happens to include all keys / ordering-insensitive subsets.
- Runtime verification limitations:
  - Dependencies not installed; no local MongoDB/runtime execution performed by the evaluator.

## Code Quality Review

- Error handling:
  - Overdue and statistics routes already sanitize 500s via `createErrorResponse`.
  - Main tickets route still returns unsanitized internal `details` (untouched planted defect).
- Validation:
  - Priority/status validation helpers reused appropriately on overdue filtering.
- Query safety:
  - Mongo filters use structured query objects; no unsafe string concatenation observed in scoped files.
- Readability:
  - Overdue status filter indentation is slightly inconsistent; otherwise changes are small and readable.
- Minimality of change:
  - Diff is appropriately narrow (overdue filter, statistics `$sum`, one test, jest roots tweak).
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
  - No `test.only` / `describe.only`, skipped tests, or weakened existing assertions found in scoped visible tests.
- Integrity flags:
  - `jest.config.js` altered to remove `instructor/hidden-tests` from Jest roots (explained in SUBMISSION.md as a local workaround). Objective note only; not treated as evidence of cheating.
  - SUBMISSION.md Final Commit SHA left blank despite a pushed commit existing on the branch.

## Submission.md Review

- Bugs identified correctly:
  - Partially. Identified overdue filtering and statistics priority aggregation; missed HTTP method/error-safety entirely; missed overdue business ordering and statistics zero normalization as distinct planted defects.
- Root causes explained correctly:
  - Directionally correct but shallow (“not correctly filtering”, “counted tickets incorrectly”). Does not cite `$gt` vs `$lt`, lexical priority sort, `assignedTo`-gated `$sum`, or missing zero-fill.
- Claims supported by code:
  - Yes for the two code changes described. Commit message (“Fix overdue and statistics API defects”) overstates completeness relative to remaining ordering/normalization gaps.
- AI usage declared:
  - Yes; states no AI tools were used.
- Known issues disclosed:
  - No; “Known Remaining Issues” is empty despite unfinished planted defects.
- Documentation quality: Weak
  - Missing Final Commit SHA, unset confidence level, empty known issues, and incomplete bug inventory.

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 20 / 40
- Testing and verification: 5 / 10
- Code quality and safety: 6 / 10
- Submission quality and engineering judgment: 4 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 46 / 90

## Final Evaluator Summary

Shreya Tyagi correctly identified two of the three planted defect areas (overdue filtering and statistics priority counting) on the MongoDB track and landed real, minimal fixes for both. Issue 1 (HTTP 405/Allow header and sanitized 500 responses on the main tickets route) was neither identified nor changed. Issue 2 filtering is fixed, but priority ordering remains lexical rather than business-ranked, so the overdue fix is incomplete. Issue 3 priority `$sum` is corrected, but zero normalization for missing status/priority keys was not implemented. The strongest part of the submission is the focused overdue filter correction (`$lt` plus active-status exclusion) with a useful invalid-priority test. The most important gap is incomplete defect coverage—especially Issue 1 and the remaining ordering/normalization requirements. A short viva is recommended to confirm whether the trainee understood business priority ranking and zero-filled statistics versus merely matching the visible fixture.

## Recommended Viva Question

In `pages/api/tickets/overdue.ts`, after your filter fix, results are still sorted with `.sort({ priority: 1, dueDate: 1 })`. Explain what order MongoDB returns for priorities `critical`, `high`, `medium`, and `low` under that sort, why that differs from the required business order, and how you would use `lib/priority.ts` (or an aggregation rank) to fix it without hardcoding fixture titles.
