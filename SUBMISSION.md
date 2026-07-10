# Submission

## Trainee Details
Name: Swarnima
Batch:
Database Track: MongoDB
Repository: mongoldb-trainee-package-july-10
Branch: XB6-R5N-J2G
Final Commit SHA:

## Bugs Identified
1. Incorrect overdue ticket filter.
2. Overdue route included tickets that should have been excluded.
3. Ticket statistics aggregation returned incorrect priority counts.
4. Jest configuration referenced a missing `instructor/hidden-tests` directory (practice environment setup issue).
## Root Causes
1. Incorrect overdue ticket filter.
2. Overdue route included tickets that should have been excluded.
3. Ticket statistics aggregation returned incorrect priority counts.
4. Jest configuration referenced a missing `instructor/hidden-tests` directory (practice environment setup issue).

## Files Changed
- pages/api/tickets/overdue.ts
- pages/api/tickets/statistics.ts
- jest.config.js (practice environment only)

## Tests Added or Updated

## Commands Run

npm install
npm run dev

## Integrity Declaration
I confirm that I did not use any AI tools for this challenge. I only used my own work, my own notes, and official documentation for tools used in this project.

Signature / Initials:
Date:

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
