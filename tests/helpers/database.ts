import mongoose from 'mongoose';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Ticket from '../../models/Ticket';
import { FULL_FIXTURE_TICKETS, REDUCED_FIXTURE_TICKETS, REFERENCE_NOW, type TicketFixtureInput } from './fixtures';

let mongoServer: MongoMemoryServer | null = null;

function normalizeFixture(fixture: TicketFixtureInput): Record<string, unknown> {
  return {
    ...fixture,
    dueDate: new Date(fixture.dueDate),
    createdAt: new Date(fixture.createdAt),
    updatedAt: new Date(fixture.updatedAt)
  };
}

async function seedFixtures(fixtures: TicketFixtureInput[]): Promise<void> {
  await Ticket.deleteMany({});
  await Ticket.insertMany(fixtures.map(normalizeFixture));
}

export async function setupTestDatabase(): Promise<void> {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14',
      downloadDir: path.join(process.cwd(), '.cache', 'mongodb-binaries'),
      checkMD5: false
    },
    instance: {
      ip: '127.0.0.1'
    }
  });
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.TEST_NOW = REFERENCE_NOW;
}

export async function connectTestDatabase(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Test database URI is missing');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false
  });
}

export async function disconnectTestDatabase(): Promise<void> {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

export async function loadFullFixtureSet(): Promise<void> {
  await seedFixtures(FULL_FIXTURE_TICKETS);
}

export async function loadReducedFixtureSet(): Promise<void> {
  await seedFixtures(REDUCED_FIXTURE_TICKETS);
}

export async function clearTickets(): Promise<void> {
  await Ticket.deleteMany({});
}
