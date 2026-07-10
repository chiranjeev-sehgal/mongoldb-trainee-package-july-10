import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { logger } from '../../../lib/logger';
import {
  ApiValidationError,
  createErrorResponse,
  getControlledNow,
  getSingleQueryParam,
  validatePriority
} from '../../../lib/validation';
import Ticket, { type TicketRecord } from '../../../models/Ticket';
import type { ApiErrorResponse, ApiSuccessResponse } from '../../../lib/types';

type OverdueResponse = ApiSuccessResponse<TicketRecord[]> | ApiErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverdueResponse>
): Promise<void> {
  logger.info('overdue tickets route invoked', { method: req.method, path: '/api/tickets/overdue' });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    createErrorResponse(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
    return;
  }

  try {
    await connectToDatabase();

    const priorityParam = getSingleQueryParam(req.query.priority, 'priority');
    const now = getControlledNow();
    const filter: Record<string, unknown> = {
      dueDate: { $lt: now },
  status: { $nin: ['resolved', 'closed'] }
    };

    if (priorityParam) {
      filter.priority = validatePriority(priorityParam);
    }

    // Intentional defect: resolved and closed tickets should be excluded, and priority should use business order.
    const tickets = await Ticket.find(filter)
      .sort({ priority: 1, dueDate: 1 })
      .lean<TicketRecord[]>();

    res.status(200).json({
      success: true,
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    logger.error('overdue tickets route failed', error, { method: req.method });

    if (error instanceof ApiValidationError) {
      createErrorResponse(res, error.statusCode, error.message, error.code);
      return;
    }

    createErrorResponse(res, 500, 'Internal server error', 'INTERNAL_ERROR');
  }
}
