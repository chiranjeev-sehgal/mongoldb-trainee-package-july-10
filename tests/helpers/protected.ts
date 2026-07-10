export const PROTECTED_FIXTURE_TITLES = [
  'Expired login token flow',
  'Webhook retries not visible',
  'Invoice export stalls',
  'Archive retention mismatch',
  'Legacy dashboard color drift',
  'Receipt PDF spacing',
  'Bulk edit audit labels'
] as const;

export const REQUIRED_HIDDEN_TEST_FILES = [
  'integrity-checks.test.ts',
  'method-validation.test.ts',
  'overdue-edge-cases.test.ts',
  'statistics-edge-cases.test.ts',
  'validation-edge-cases.test.ts'
] as const;
