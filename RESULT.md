# Hackathon Evaluation Result

## Submission Identity

- Name: Swarnima
- Trainee ID: Not Provided
- Database Track: MongoDB
- Branch: XB6-R5N-J2G
- Final Commit: 913d91c9a57de70f217f1b4ce2c4e5d1679029bf

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` was not present, so `npm run test:visible`, typecheck, lint, and build were not executed.
  - Evaluation is based on static review of scoped files and Git diff (`d64755b` changed only `overdue.ts`, plus `jest.config.js` / `.gitignore`).

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`.
- What is correct:
  - GET and POST handlers already exist and were left intact.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal errors still expose `details` (raw `error.message`) to the client.
  - Intentional defect comments remain in place.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: default `handler` — unsupported-method branch returns `res.status(400)...`; catch block returns `details` from `error.message`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - Changed `dueDate` filter from `$gt` to `$lt`.
  - Added `status: { $nin: ['resolved', 'closed'] }`.
- What is correct:
  - Overdue means `dueDate` before current time (`getControlledNow()`).
  - Active statuses only: open/in_progress included; resolved/closed excluded.
  - Optional priority filter via `validatePriority` remains in place.
- What is incomplete or incorrect:
  - Sort remains `.sort({ priority: 1, dueDate: 1 })`, which is alphabetical string order (`critical`, `high`, `low`, `medium`), not business order (`critical`, `high`, `medium`, `low`).
  - Available helpers in `lib/priority.ts` (`comparePriorities` / `priorityWeight`) were not used.
  - Intentional defect comment about priority business order was left unaddressed.
- Evidence:
  - file: `pages/api/tickets/overdue.ts`
  - relevant function or logic: filter object uses `$lt` + `$nin`; query still sorts by raw `priority` ascending
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No code changes to `pages/api/tickets/statistics.ts` (Git confirms only `overdue.ts` among ticket routes was modified).
- What is correct:
  - Total count and overdue-active count logic were already present and correct in the planted baseline (`countDocuments` with `$nin` for resolved/closed).
  - Status aggregation uses `$sum: 1` (correct counting pattern), but still lacks zero normalization.
- What is incomplete or incorrect:
  - Priority aggregation still counts with `$sum: { $cond: [{ $ifNull: ['$assignedTo', false] }, 1, 0] }` instead of document count.
  - Neither `byStatus` nor `byPriority` is normalized to include all expected keys with zeros.
  - SUBMISSION.md claims this file was changed and that priority counts were fixed; the code does not support that claim.
- Evidence:
  - file: `pages/api/tickets/statistics.ts`
  - relevant function or logic: priority `$group` still uses assignedTo-conditional `$sum`; reduce steps build partial maps without zero-fill
- Submission.md consistency: Inaccurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` unavailable)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None (SUBMISSION.md Tests section is empty; Git shows no test file changes)
- Quality of tests: N/A for trainee-authored tests; existing visible tests were not modified or weakened
- Runtime verification limitations:
  - Dependencies not installed in this evaluation environment.
  - No MongoDB runtime verification performed.
  - Static analysis is sufficient to judge planted-issue correctness.

## Code Quality Review

- Error handling: Unchanged on main tickets route; still unsafe error leakage via `details`. Overdue/statistics routes retain sanitized 500 handling.
- Validation: Existing validation helpers reused correctly for overdue priority filter; no new validation issues introduced.
- Query safety: Overdue filter change is a safe, parameterized Mongo query update; no raw unsafe injection introduced.
- Readability: Overdue filter change is clear, though indentation of the new `status` line is inconsistent.
- Minimality of change: Functional ticket-route change is minimal and scoped to overdue filtering; however `jest.config.js` was also changed.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No (visible tests untouched; no `only`/`skip`)
- Integrity flags:
  - `jest.config.js` roots updated to remove `instructor/hidden-tests` (documented by trainee as practice-environment setup; objectively alters test discovery for instructor suites).
  - SUBMISSION.md lists `pages/api/tickets/statistics.ts` under Files Changed, but Git history shows no such change.
  - Commit message is non-descriptive: `Your commit message`.

## Submission.md Review

- Bugs identified correctly: Partially — overdue filter/exclusion identified; HTTP method/error-safety issue omitted; statistics claimed but not fixed in code.
- Root causes explained correctly: No — root-cause section restates the bug list verbatim without technical cause analysis (`$gt` vs `$lt`, alphabetical sort, assignedTo-based `$sum`, missing zero-fill, 400 vs 405 / error `details`).
- Claims supported by code: Partially — overdue filter claim matches code; statistics fix claim does not; files-changed list overstates scope.
- AI usage declared: Yes — declares no AI tools used.
- Known issues disclosed: No — section left blank; confidence left as template text `Low / Medium / High`.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 8 / 20
- Functional correctness of planted issues: 10 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 5 / 10
- Submission quality and engineering judgment: 3 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 28 / 90

## Final Evaluator Summary

The trainee identified the overdue filtering problem and correctly fixed the date comparison and status exclusion, which is the strongest part of the submission. Priority business ordering was left incorrect, and the HTTP method/error-safety issue was not identified or fixed. Statistics defects remain fully present despite SUBMISSION.md claiming a statistics fix and listing `statistics.ts` as changed. Documentation quality is weak: root causes are duplicated symptom statements, verification commands do not include the visible test suite, and several template fields were left incomplete. A viva is recommended to separate genuine understanding of the overdue fix from unsupported statistics claims. Ask specifically how priority ordering should work when both `medium` and `low` overdue tickets exist, and why alphabetical MongoDB sort is insufficient.

## Recommended Viva Question

In `pages/api/tickets/overdue.ts`, after your filter fix, results are still sorted with `.sort({ priority: 1, dueDate: 1 })`. Given priorities `critical`, `high`, `medium`, and `low`, what order does that MongoDB sort produce, and how would you change the query (or post-processing) to enforce business order `critical → high → medium → low` without hardcoding fixture titles?
