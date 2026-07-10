# Submission

## Trainee Details
Name: Adarsh Mishra
Batch:
Database Track: MongoDB
Repository:
Branch:
Final Commit SHA:

## Bugs Identified
- Fixed overdue ticket filtering logic.
- Excluded resolved and closed tickets from overdue results.
- Fixed priority aggregation in statistics.
- Normalized missing priority categories to zero.
- Fixed Jest configuration for trainee package.

## Root Causes
- Incorrect date comparison.
- Missing business rule for active tickets.
- Incorrect MongoDB aggregation logic.
- Missing default values for response.
- Invalid Jest root configuration.

## Files Changed
- jest.config.js
- pages/api/tickets/overdue.ts
- pages/api/tickets/statistics.ts

## Tests Added or Updated
- Added one relevant test case. *(Replace if you added a specific test.)*

## Commands Run
```bash
npm ci
npm run test:visible
npm run build