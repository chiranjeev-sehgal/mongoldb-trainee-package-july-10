import type { NextApiResponse } from 'next';
import { TICKET_PRIORITIES, TICKET_STATUSES, type ApiErrorResponse, type TicketPriority, type TicketStatus } from './types';

export class ApiValidationError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, code = 'VALIDATION_ERROR', statusCode = 400) {
    super(message);
    this.name = 'ApiValidationError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function createErrorResponse(
  response: NextApiResponse<ApiErrorResponse>,
  statusCode: number,
  message: string,
  code: string
): void {
  response.status(statusCode).json({
    success: false,
    error: {
      message,
      code
    }
  });
}

export function getSingleQueryParam(value: string | string[] | undefined, name: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    throw new ApiValidationError(`${name} must be a single value`, 'INVALID_QUERY_PARAM');
  }

  return value;
}

export function validateStatus(value: string): TicketStatus {
  if (!TICKET_STATUSES.includes(value as TicketStatus)) {
    throw new ApiValidationError('Invalid status', 'INVALID_STATUS');
  }

  return value as TicketStatus;
}

export function validatePriority(value: string): TicketPriority {
  if (!TICKET_PRIORITIES.includes(value as TicketPriority)) {
    throw new ApiValidationError('Invalid priority', 'INVALID_PRIORITY');
  }

  return value as TicketPriority;
}

export function validateRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiValidationError(`${fieldName} is required`, 'INVALID_INPUT');
  }

  return value.trim();
}

export function validateIsoDate(value: unknown, fieldName: string): Date {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiValidationError(`${fieldName} is required`, 'INVALID_INPUT');
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiValidationError(`${fieldName} must be a valid ISO date`, 'INVALID_INPUT');
  }

  return parsed;
}

export function getControlledNow(): Date {
  const override = process.env.TEST_NOW;
  return override ? new Date(override) : new Date();
}
