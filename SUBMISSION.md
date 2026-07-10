# Submission

## Trainee Details
Name:Shreya Tyagi
Batch:A
Database Track: MongoDB
Repository:mongoldb-trainee-package-july-10
Branch:DF9-P3K-W8C
Final Commit SHA:

## Bugs Identified
1. Incorrect overdue ticket filtering.
2. Incorrect priority aggregation in the statistics API.
## Root Causes
- The overdue API was not correctly filtering overdue active tickets.
- The statistics API counted tickets incorrectly for priority aggregation.
## Files Changed
- pages/api/tickets/overdue.ts
- pages/api/tickets/statistics.ts
- jest.config.js (local configuration change to run visible tests because the provided trainee package referenced a missing `instructor/hidden-tests` directory.)
## Tests Added or Updated
Added a test to verify that an invalid priority filter returns a 400 Bad Request response.
## Commands Run
- npm install
- npm run test:visible
- git checkout -b DF9-P3K-W8C
- git add .
- git commit -m "Fix overdue and statistics API defects and add overdue validation test"
- git push -u origin DF9-P3K-W8C
## Integrity Declaration
I confirm that I did not use any AI tools for this challenge. I only used my own work, my own notes, and official documentation for tools used in this project.

Signature / Initials:
Date:

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
