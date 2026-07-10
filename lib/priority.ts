import type { TicketPriority } from './types';

const BUSINESS_PRIORITY_ORDER: Record<TicketPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

export function comparePriorities(left: TicketPriority, right: TicketPriority): number {
  return BUSINESS_PRIORITY_ORDER[left] - BUSINESS_PRIORITY_ORDER[right];
}

export function priorityWeight(priority: TicketPriority): number {
  return BUSINESS_PRIORITY_ORDER[priority];
}
