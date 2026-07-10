import handler from '../../pages/api/tickets/statistics';
import { invokeRoute } from '../helpers/request';

describe('/api/tickets/statistics', () => {
  it('returns aggregate counts for the default fixture set', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET'
    });

    expect(res.statusCode).toBe(200);
    expect(body).toMatchObject({
      success: true,
      data: {
        total: 7,
        byStatus: {
          open: 3,
          in_progress: 2,
          resolved: 1,
          closed: 1
        },
        byPriority: {
          low: 1,
          medium: 2,
          high: 2,
          critical: 2
        },
        overdueActive: 3
      }
    });
  });
});
