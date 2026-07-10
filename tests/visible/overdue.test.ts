import handler from '../../pages/api/tickets/overdue';
import { invokeRoute } from '../helpers/request';

describe('/api/tickets/overdue', () => {
  it('returns only active overdue tickets in business order', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET'
    });

    expect(res.statusCode).toBe(200);
    expect(body).toMatchObject({
      success: true,
      count: 3
    });

    const titles = (body as { data: Array<{ title: string }> }).data.map((ticket) => ticket.title);
    expect(titles).toEqual([
      'Expired login token flow',
      'Webhook retries not visible',
      'Invoice export stalls'
    ]);
  });

  it('supports priority filtering', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET',
      query: {
        priority: 'critical'
      }
    });

    expect(res.statusCode).toBe(200);
    expect((body as { count: number }).count).toBe(1);
  });
});
