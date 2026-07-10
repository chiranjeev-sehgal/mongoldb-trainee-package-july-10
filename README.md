# Debugging Olympics — Month 2: MongoDB Track

This repository contains the MongoDB version of the Month 2 individual trainee hackathon. It evaluates debugging across Next.js API routes, Mongoose-backed data access, validation, test-driven fixes, and safe error handling.

This is the MongoDB-track repository. Its domain, API contracts, fixture data, scoring, and intentional business defects are designed to match the PostgreSQL-track assessment, with persistence implementation as the only meaningful difference.

## Purpose

- Debug intentionally broken business logic in a strict TypeScript Next.js codebase.
- Diagnose MongoDB and Mongoose query behavior through automated tests.
- Practice safe HTTP handling, validation, and sanitized production-style error responses.

## Prerequisites

- Node.js 20
- npm 10+

## Installation

```bash
npm ci
```

## Environment Setup

Copy the sample environment file and set a MongoDB connection string if you want to run the app against a real local or remote database:

```bash
cp .env.example .env.local
```

Automated tests use MongoDB Memory Server, so they do not require a locally installed MongoDB instance.

## Local Development

```bash
npm run dev
```

API routes:

- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/overdue`
- `GET /api/tickets/statistics`

## Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run test:visible
npm run test:hidden
npm run test:all
npm run seed
npm run evaluate
npm run package:trainee
```

## Repository Structure

- `pages/api/tickets`: API routes under assessment
- `lib`: database, validation, logging, and priority helpers
- `models`: Mongoose models
- `tests/visible`: trainee-visible tests
- `instructor`: hidden tests, scoring, and answer materials

## Instructor Notes

- Do not distribute the `instructor/` directory, hidden tests, or answer materials to trainees.
- Hidden tests are intended to run from a protected instructor branch, a private evaluator repository, or an instructor-controlled local workflow.
- `npm run evaluate` generates machine-readable and Markdown scoring reports under `reports/`.
