import mongoose from 'mongoose';
import { connectToDatabase } from '../lib/mongodb';
import Ticket from '../models/Ticket';
import { FULL_FIXTURE_TICKETS } from '../tests/helpers/fixtures';

async function main(): Promise<void> {
  await connectToDatabase();
  await Ticket.deleteMany({});
  await Ticket.insertMany(
    FULL_FIXTURE_TICKETS.map((ticket) => ({
      ...ticket,
      dueDate: new Date(ticket.dueDate),
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt)
    }))
  );

  console.log(`Seeded ${FULL_FIXTURE_TICKETS.length} tickets`);
  await mongoose.disconnect();
}

main().catch((error: unknown) => {
  console.error('Seed failed', error);
  process.exitCode = 1;
});
