import { afterAll, beforeAll, beforeEach, jest } from '@jest/globals';
import { connectTestDatabase, disconnectTestDatabase, loadFullFixtureSet, setupTestDatabase } from './database';
import { REFERENCE_NOW } from './fixtures';

jest.setTimeout(120000);

beforeAll(async () => {
  await setupTestDatabase();
  await connectTestDatabase();
});

beforeEach(async () => {
  process.env.TEST_NOW = REFERENCE_NOW;
  await loadFullFixtureSet();
});

afterAll(async () => {
  await disconnectTestDatabase();
});
