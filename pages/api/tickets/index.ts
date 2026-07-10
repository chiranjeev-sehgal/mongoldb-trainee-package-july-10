import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { logger } from '../../../lib/logger';
import {
  ApiValidationError,
  createErrorResponse,
  getSingleQueryParam,
  validateIsoDate,
  validatePriority,
  validateRequiredString,
  validateStatus
} from '../../../lib/validation';
import Ticket, { type TicketRecord } from '../../../models/Ticket';
import type { ApiErrorResponse, ApiSuccessResponse } from '../../../lib/types';

type TicketListResponse = ApiSuccessResponse<TicketRecord[] | TicketRecord> | ApiErrorResponse;

interface CreateTicketBody {
  title?: unknown;
  description?: unknown;
  status?: unknown;
  priority?: unknown;
  dueDate?: unknown;
  assignedTo?: unknown;
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<TicketListResponse>): Promise<void> {
  const statusParam = getSingleQueryParam(req.query.status, 'status');
  const priorityParam = getSingleQueryParam(req.query.priority, 'priority');
  const assignedToParam = getSingleQueryParam(req.query.assignedTo, 'assignedTo');

  const filter: Record<string, string> = {};

  if (statusParam) {
    filter.status = validateStatus(statusParam);
  }

  if (priorityParam) {
    filter.priority = validatePriority(priorityParam);
  }

  if (assignedToParam) {
    filter.assignedTo = assignedToParam;
  }

  const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean<TicketRecord[]>();

  res.status(200).json({
    success: true,
    data: tickets,
    count: tickets.length
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<TicketListResponse>): Promise<void> {
  const body = req.body as CreateTicketBody;
  const title = validateRequiredString(body.title, 'title');
  const description = validateRequiredString(body.description, 'description');
  const status = validateStatus(validateRequiredString(body.status, 'status'));
  const priority = validatePriority(validateRequiredString(body.priority, 'priority'));
  const dueDate = validateIsoDate(body.dueDate, 'dueDate');
  const assignedTo =
    typeof body.assignedTo === 'string' && body.assignedTo.trim().length > 0
      ? body.assignedTo.trim()
      : undefined;

  const createdTicket = await Ticket.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo
  });

  res.status(201).json({
    success: true,
    data: createdTicket.toObject() as TicketRecord
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TicketListResponse>
): Promise<void> {
  logger.info('tickets route invoked', { method: req.method, path: '/api/tickets' });

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      await handleGet(req, res);
      return;
    }

    if (req.method === 'POST') {
      await handlePost(req, res);
      return;
    }

    // Intentional defect: unsupported methods should be 405 with an Allow header.
    res.status(400).json({
      success: false,
      error: {  
        message: `Unsupported method: ${req.method ?? 'unknown'}`,
        code: 'METHOD_NOT_ALLOWED'
      }
    });
    return;
  } catch (error) {
    logger.error('tickets route failed', error, { method: req.method });

    if (error instanceof ApiValidationError) {
      createErrorResponse(res, error.statusCode, error.message, error.code);
      return ;  
    }

    const details = error instanceof Error ? error.message : 'Unknown error';

    // Intentional defect: diagnostics are returned to the client instead of being sanitized.
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process tickets request',
        code: 'INTERNAL_ERROR',
        details
      }
    });
    return ;
  }
}
