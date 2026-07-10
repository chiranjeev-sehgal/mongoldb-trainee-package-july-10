import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { logger } from '../../../lib/logger';
import { createErrorResponse, getControlledNow } from '../../../lib/validation';
import Ticket from '../../../models/Ticket';
import type { ApiErrorResponse, ApiSuccessResponse, TicketPriority, TicketStatus } from '../../../lib/types';

interface StatisticsPayload {
  total: number;
  byStatus: Partial<Record<TicketStatus, number>>;
  byPriority: Partial<Record<TicketPriority, number>>;
  overdueActive: number;
}

type StatisticsResponse = ApiSuccessResponse<StatisticsPayload> | ApiErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatisticsResponse>
): Promise<void> {
  logger.info('ticket statistics route invoked', { method: req.method, path: '/api/tickets/statistics' });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    createErrorResponse(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
    return;
  }

  try {
    await connectToDatabase();

    const now = getControlledNow();
    const [total, byStatusRaw, byPriorityRaw, overdueActive] = await Promise.all([
      Ticket.countDocuments({}),
      Ticket.aggregate<{ _id: TicketStatus; count: number }>([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Ticket.aggregate<{ _id: TicketPriority; count: number }>([
        {
          $group: {
            _id: '$priority',
            // Intentional defect: counts rely on assignedTo presence instead of document count.
            count: { $sum: 
              { $cond: [{ 
                $ifNull: ['$assignedTo', 'false'] 
              }, 1, 0] } }
          }
        }
      ]),
      Ticket.countDocuments({
        dueDate: { $lt: now },
        status: { $nin: ['resolved', 'closed'] }
      })
    ]);

    const byStatus = byStatusRaw.reduce<Partial<Record<TicketStatus, number>>>((accumulator, entry) => {
      accumulator[entry._id] = entry.count;
      return accumulator;
    }, {});

    // Intentional defect: absent categories are not normalized to zero.
    const byPriority = byPriorityRaw.reduce<Partial<Record<TicketPriority, number>>>((accumulator, entry) => {
      accumulator[entry._id] = entry.count;
      return accumulator;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        total,
        byStatus,
        byPriority,
        overdueActive
      }
    });
   
  } catch (error) {
    logger.error('ticket statistics route failed', error, { method: req.method });
    createErrorResponse(res, 500, 'Internal server error', 'INTERNAL_ERROR');
  }
}
