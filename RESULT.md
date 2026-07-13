# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Kashish Chaudhary
- Trainee ID: Not Provided
- Database Track: MongoDB
- Branch: VK2-M8B-H5Z
- Final Commit: 665bbc1f9cc3389a9f489a8b4ada38acd0e45a42

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
  - Runtime MongoDB verification was unavailable; assessment is based on static code review and git diffs against the challenge baseline.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts` (confirmed via git history/diff against challenge baseline).
- What is correct:
  - GET and POST handlers themselves remain present and structurally intact.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal errors still expose `details` derived from `error.message`, which can leak connection/driver diagnostics.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: default `handler` catch path and unsupported-method branch (still marked as intentional defects; status 400; `details` included in 500 payload)
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 9 / 15
- What the trainee changed:
  - Changed overdue filter from `dueDate: { $gt: now }` to `dueDate: { $lt: now }`.
  - Added `status: { $nin: ['closed', 'resolved'] }` so resolved/closed tickets are excluded.
- What is correct:
  - Overdue means dueDate before current/controlled now.
  - Active statuses (open / in_progress) are included by excluding resolved and closed.
  - Optional priority filter still uses `validatePriority`.
  - Secondary sort by `dueDate: 1` (oldest first within equal priority) is present.
- What is incomplete or incorrect:
  - Priority ordering still uses Mongo lexicographic `.sort({ priority: 1, dueDate: 1 })`, which yields `critical → high → low → medium`, not the required business order `critical → high → medium → low`.
  - Existing helpers in `lib/priority.ts` (`comparePriorities` / `priorityWeight`) were not used; no aggregation/rank field or application-side business sort was added.
- Evidence:
  - file: `pages/api/tickets/overdue.ts`
  - relevant function or logic: `filter` with `$lt` / `$nin`; `Ticket.find(filter).sort({ priority: 1, dueDate: 1 })`
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 11 / 15
- What the trainee changed:
  - Replaced defective priority count `$sum: { $cond: [{ $ifNull: ['$assignedTo', false] }, 1, 0] }` with `$sum: 1`.
  - Zero-normalized `byPriority` for `low`, `medium`, `high`, and `critical`, then overwrote with aggregation results.
- What is correct:
  - Total uses `countDocuments`.
  - Status and priority grouping use `$group` / `$sum: 1` (priority counting defect fixed).
  - `overdueActive` correctly counts overdue tickets excluding resolved/closed.
  - Priority zero-fill is dynamic normalization, not fixture hardcoding.
- What is incomplete or incorrect:
  - `byStatus` is still built only from aggregation results into a `Partial` record; absent status keys are not forced to `0` for `open`, `in_progress`, `resolved`, and `closed`.
  - Intentional-defect comments remain; formatting in the priority normalization block is messy but functionally acceptable for priorities.
- Evidence:
  - file: `pages/api/tickets/statistics.ts`
  - relevant function or logic: priority `$group` with `$sum: 1`; `byPriority` zero-filled object; `byStatus` reduce without zero baseline; `overdueActive` `countDocuments`
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed:
  - No visible test files changed.
  - `jest.config.js` was modified: removed `instructor/hidden-tests` from `roots` and added `pages`, `lib`, and `models`.
- Quality of tests:
  - Visible suite remains the original challenge tests; trainee did not add regression coverage for method handling, business priority order, or status zero-normalization.
- Runtime verification limitations:
  - Dependencies not installed; no local MongoDB/runtime verification performed. Evaluation relies on static analysis and git history.

## Code Quality Review

- Error handling:
  - Overdue and statistics routes sanitize 500s via `createErrorResponse`.
  - Main tickets route still returns unsanitized `details` on internal errors.
- Validation:
  - Priority validation on overdue remains correct.
  - No new validation regressions observed in scoped files.
- Query safety:
  - Overdue/statistics queries remain parameterized Mongo filters; no unsafe string-built queries introduced.
- Readability:
  - Overdue/statistics indentation and leftover intentional-defect comments are inconsistent; logic is still readable.
- Minimality of change:
  - Scoped API changes are limited to overdue filter and statistics counting/normalization; Issue 1 untouched.
  - Jest config change is unrelated to the planted API defects.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: Yes
- Integrity flags:
  - `jest.config.js` no longer includes `instructor/hidden-tests` in Jest `roots` (reduces default discovery of hidden tests when running broader Jest invocations).
  - SUBMISSION.md Final Commit SHA is invalid (`4:30`); actual HEAD is `665bbc1f9cc3389a9f489a8b4ada38acd0e45a42`.
  - No skipped/focused visible tests (`test.only` / `describe.only`) and no weakened visible assertions observed.
  - No hardcoded API responses or static fixture arrays replacing database logic in scoped API files.

## Submission.md Review

- Bugs identified correctly:
  - Partially. Mentions Overdue Tickets API and Ticket Statistics API, but does not identify HTTP method/error-safety on the main tickets route. Also lists MongoDB environment configuration, Jest configuration, and “Test Status,” which are outside the three planted defect categories.
- Root causes explained correctly:
  - No. The Root Causes section is empty.
- Claims supported by code:
  - Partial. Files Changed correctly lists overdue/statistics (plus jest), matching the diff. Claims do not demonstrate Issue 1 work or complete ordering/status-normalization fixes.
- AI usage declared:
  - Yes. Declares no AI tools were used.
- Known issues disclosed:
  - No. Known Remaining Issues is empty despite unfinished Issue 1 and remaining ordering/status gaps.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 8 / 20
- Functional correctness of planted issues: 20 / 40
- Testing and verification: 3 / 10
- Code quality and safety: 5 / 10
- Submission quality and engineering judgment: 4 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 40 / 90

## Final Evaluator Summary

Kashish Chaudhary correctly targeted two of the three planted areas (overdue filtering and statistics counting) but did not address HTTP method handling or error sanitization on the main tickets route. Overdue filtering is largely fixed (`$lt` and exclusion of resolved/closed), yet priority sorting remains lexicographic rather than business order. Statistics priority counting and priority zero-normalization are fixed, but status zero-normalization is still missing. The strongest part of the submission is the overdue filter correction plus replacing the assignedTo-based priority `$sum`. The most important gaps are the untouched Issue 1 defects and incorrect priority ordering. A viva is recommended to confirm whether the trainee understands business priority ranking versus Mongo string sort, and why status keys still need explicit zero-fill. Submission documentation is thin: empty root causes, weak verification notes, and an invalid final commit SHA.

## Recommended Viva Question

In `pages/api/tickets/overdue.ts`, after fixing the filter, you kept `.sort({ priority: 1, dueDate: 1 })`. Walk through what MongoDB returns for priorities `medium` and `low`, explain why that differs from the required business order `critical → high → medium → low`, and show how you would implement the correct ranking using either aggregation or `lib/priority.ts`.
