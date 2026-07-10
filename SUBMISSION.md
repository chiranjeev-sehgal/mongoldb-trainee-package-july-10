# Submission

## Trainee Details
Name: Adarsh kumar mishra
Batch: A
Database Track: MongoDB
Repository: 
Branch:
Final Commit SHA:

## Bugs Identified
- Fixed overdue ticket filtering logic
- Excluded resolved and closed tickets from overdue results
- Fixed the  priority aggregation in statistics.ts
- Normalized missing priority category to zero
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

## Commands Run
```bash
npm ci
npm run test:visible
npm run build

## Integrity Declaration
I confirm that I did not use any AI tools for this challenge. I only used my own work, my own notes, and official documentation for tools used in this project.

Signature / Initials:
Date: 10-07-2026

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
