import { Schema, model, models, type HydratedDocument, type Model } from 'mongoose';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../lib/types';

export interface TicketRecord {
  title: string;
  description: string;
  status: (typeof TICKET_STATUSES)[number];
  priority: (typeof TICKET_PRIORITIES)[number];
  assignedTo?: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<TicketRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      required: true
    },
    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      required: true
    },
    assignedTo: {
      type: String,
      required: false,
      trim: true
    },
    dueDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type TicketDocument = HydratedDocument<TicketRecord>;

const Ticket =
  (models.Ticket as Model<TicketRecord> | undefined) ?? model<TicketRecord>('Ticket', ticketSchema);

export default Ticket;
