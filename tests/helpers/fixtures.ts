import type { TicketPriority, TicketStatus } from '../../lib/types';

export const REFERENCE_NOW = '2025-02-01T12:00:00.000Z';

export interface TicketFixtureInput {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export const FULL_FIXTURE_TICKETS: TicketFixtureInput[] = [
  {
    title: 'Expired login token flow',
    description: 'Customers cannot refresh tokens after timeout.',
    status: 'open',
    priority: 'critical',
    assignedTo: 'Asha',
    dueDate: '2025-01-28T09:00:00.000Z',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z'
  },
  {
    title: 'Webhook retries not visible',
    description: 'Retry counts are missing from the admin console.',
    status: 'open',
    priority: 'high',
    dueDate: '2025-01-30T12:00:00.000Z',
    createdAt: '2025-01-18T10:00:00.000Z',
    updatedAt: '2025-01-18T10:00:00.000Z'
  },
  {
    title: 'Invoice export stalls',
    description: 'Exports stall when large filters are selected.',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Ravi',
    dueDate: '2025-01-27T16:00:00.000Z',
    createdAt: '2025-01-17T08:00:00.000Z',
    updatedAt: '2025-01-19T10:00:00.000Z'
  },
  {
    title: 'Archive retention mismatch',
    description: 'Retention period text does not match behavior.',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Mina',
    dueDate: '2025-01-26T11:00:00.000Z',
    createdAt: '2025-01-11T08:00:00.000Z',
    updatedAt: '2025-01-25T10:00:00.000Z'
  },
  {
    title: 'Legacy dashboard color drift',
    description: 'Closed issue retained for auditing.',
    status: 'closed',
    priority: 'high',
    dueDate: '2025-01-24T14:00:00.000Z',
    createdAt: '2025-01-09T08:00:00.000Z',
    updatedAt: '2025-01-24T16:00:00.000Z'
  },
  {
    title: 'Receipt PDF spacing',
    description: 'Spacing breaks on narrow templates.',
    status: 'open',
    priority: 'medium',
    dueDate: '2025-02-04T09:00:00.000Z',
    createdAt: '2025-01-22T07:00:00.000Z',
    updatedAt: '2025-01-22T07:00:00.000Z'
  },
  {
    title: 'Bulk edit audit labels',
    description: 'Audit labels need cleanup before release.',
    status: 'in_progress',
    priority: 'critical',
    assignedTo: 'Ishan',
    dueDate: '2025-02-05T15:00:00.000Z',
    createdAt: '2025-01-23T07:00:00.000Z',
    updatedAt: '2025-01-24T07:00:00.000Z'
  }
];

export const REDUCED_FIXTURE_TICKETS: TicketFixtureInput[] = [
  FULL_FIXTURE_TICKETS[0]!,
  FULL_FIXTURE_TICKETS[2]!,
  FULL_FIXTURE_TICKETS[5]!
];
