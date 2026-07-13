# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Adarsh kumar mishra
- Trainee ID: Not Provided
- Database Track: MongoDB
- Branch: TX7-K4N-P9Q
- Final Commit: 54287a2bb8252973c5686629a8db038a23f2e99d

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is absent, so typecheck, lint, build, and visible tests were not executed.
  - Runtime MongoDB verification was unavailable; assessment is based on static review of scoped files and the trainee commit diff.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`. The file was not listed in SUBMISSION.md and is unchanged in the final commit.
- What is correct:
  - Nothing related to this planted issue. GET/POST handlers themselves remain intact, but the method/error defects were not touched.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal errors still expose `details` from `error.message` to the client (unsanitized diagnostics).
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: default `handler` — unsupported-method branch returns `res.status(400)` without `Allow`; catch block returns `details` from the error message
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - Changed `dueDate` filter from `$gt` to `$lt`.
  - Added `status: { $nin: ['resolved', 'closed'] }`.
- What is correct:
  - Overdue means due before current controlled time.
  - Resolved and closed tickets are excluded; open and in_progress remain eligible.
  - Optional priority filtering via `validatePriority` is preserved.
  - Invalid priority still rejects through existing validation.
- What is incomplete or incorrect:
  - Ordering still uses `.sort({ priority: 1, dueDate: 1 })`, which is lexicographic string order, not business order (`critical` → `high` → `medium` → `low`).
  - Available helpers in `lib/priority.ts` (`priorityWeight` / `comparePriorities`) were not used.
  - Intentional defect comment about priority business order remains unresolved.
- Evidence:
  - file: `pages/api/tickets/overdue.ts`
  - relevant function or logic: `filter` with `$lt` / `$nin`; `Ticket.find(filter).sort({ priority: 1, dueDate: 1 })`
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - Changed priority aggregation from `$sum: { $cond: [{ $ifNull: ['$assignedTo', false] }, 1, 0] }` to `$sum: 1`.
- What is correct:
  - Priority counts now count documents, not tickets with `assignedTo`.
  - Total count, status grouping, and active overdue count (`dueDate < now` and status not resolved/closed) remain structurally correct.
  - No hardcoded fixture totals were introduced.
- What is incomplete or incorrect:
  - Missing status/priority categories are still not normalized to `0`.
  - `byStatus` and `byPriority` remain `Partial<Record<...>>` filled only from aggregation results.
  - SUBMISSION.md claims “Normalized missing priority category to zero,” but the code does not implement that.
- Evidence:
  - file: `pages/api/tickets/statistics.ts`
  - relevant function or logic: priority `$group` with `count: { $sum: 1 }`; `byStatus` / `byPriority` reduce without zero-filled defaults
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed:
  - No visible test files were added or updated.
  - `jest.config.js` was changed to remove `<rootDir>/instructor/hidden-tests` from `roots`.
- Quality of tests:
  - Existing visible tests are unchanged and still assert overdue ordering and full statistics shape for the fixture set.
  - Trainee did not add regression coverage for 405/Allow, sanitized errors, business-priority sort, or zero normalization.
- Runtime verification limitations:
  - Dependencies not installed; no local test/build/typecheck evidence available in this evaluation environment.
  - Claims of `npm ci`, `npm run test:visible`, and `npm run build` in SUBMISSION.md could not be corroborated here.

## Code Quality Review

- Error handling:
  - Overdue and statistics routes sanitize 500s via `createErrorResponse`.
  - Main tickets route still leaks internal `details` and mishandles unsupported methods.
- Validation:
  - Existing priority/status validation helpers remain in use where applicable.
- Query safety:
  - Overdue/statistics queries use parameterized Mongo filters; no raw unsafe query strings observed.
- Readability:
  - Changes are small and readable.
- Minimality of change:
  - Application changes are narrowly scoped to overdue and statistics, but Issue 1 was missed.
  - `jest.config.js` change is unrelated to the planted API defects.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: Yes
- Integrity flags:
  - `jest.config.js` roots narrowed to exclude `instructor/hidden-tests` (weakens default Jest discovery of hidden tests).
  - Commit message “All three bugs fixed” overstates the actual code changes.
  - SUBMISSION.md claims zero-normalization that is not present in code.
  - No `test.only` / `describe.only` / skipped tests found in visible tests.
  - No hardcoded API responses or static fixture arrays replacing DB logic found in scoped API files.

## Submission.md Review

- Bugs identified correctly:
  - Partially. Overdue filtering and priority aggregation were identified; HTTP method/error-safety was omitted; zero normalization was claimed but not implemented.
- Root causes explained correctly:
  - Partially accurate for date comparison, active-ticket exclusion, and aggregation counting.
  - “Missing default values for response” is stated, but not reflected in code.
  - “Invalid Jest root configuration” is not one of the planted API defects.
- Claims supported by code:
  - Overdue `$lt` + status exclusion: supported.
  - Priority `$sum: 1`: supported.
  - Zero normalization: not supported.
  - “All three bugs” / complete fix narrative: not supported.
- AI usage declared:
  - Yes — states no AI tools were used.
- Known issues disclosed:
  - No — section left blank despite remaining defects.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 20 / 40
- Testing and verification: 4 / 10
- Code quality and safety: 5 / 10
- Submission quality and engineering judgment: 5 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 45 / 90

## Final Evaluator Summary

The trainee correctly identified two of the three planted problem areas (overdue filtering and statistics counting) and fully fixed only parts of each. Overdue date comparison and active-status exclusion are correct, and priority aggregation now counts documents with `$sum: 1`, but business-priority ordering and zero-key normalization remain unfinished. Issue 1 (HTTP 405, Allow header, and sanitized internal errors) was not addressed at all in code or in SUBMISSION.md. The strongest part of the submission is the focused overdue filter fix, which matches the intended root cause. The most important gap is the untouched tickets route safety defects, compounded by an unsupported claim of zero normalization and a Jest config change that excludes hidden tests from roots. A viva is recommended. Ask why lexicographic Mongo sort on `priority` is insufficient for the required business order and how they would normalize missing status/priority keys to zero without hardcoding fixture totals.

## Recommended Viva Question

In `pages/api/tickets/overdue.ts`, you kept `.sort({ priority: 1, dueDate: 1 })` after fixing the filter — explain what order that produces for priorities `critical`, `high`, `medium`, and `low`, why it differs from the required business order, and how you would implement the correct ranking (for example using `lib/priority.ts`) without hardcoding fixture ticket titles.
