import handler from '../../pages/api/tickets/index';
import Ticket from '../../models/Ticket';
import { invokeRoute } from '../helpers/request';

describe('/api/tickets', () => {
  it('returns tickets sorted newest first', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET'
    });

    expect(res.statusCode).toBe(200);
    expect(body).toMatchObject({
      success: true,
      count: 7
    });

    const data = (body as { data: Array<{ title: string }> }).data;
    expect(data.map((ticket) => ticket.title)).toEqual([
      'Bulk edit audit labels',
      'Receipt PDF spacing',
      'Webhook retries not visible',
      'Invoice export stalls',
      'Expired login token flow',
      'Archive retention mismatch',
      'Legacy dashboard color drift'
    ]);
  });

  it('filters by status', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET',
      query: {
        status: 'open'
      }
    });

    expect(res.statusCode).toBe(200);
    expect((body as { count: number }).count).toBe(3);
  });

  it('filters by priority', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET',
      query: {
        priority: 'critical'
      }
    });

    expect(res.statusCode).toBe(200);
    expect((body as { count: number }).count).toBe(2);
  });

  it('filters by assignee', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'GET',
      query: {
        assignedTo: 'Asha'
      }
    });

    expect(res.statusCode).toBe(200);
    expect((body as { count: number }).count).toBe(1);
  });

  it('creates a ticket', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'POST',
      body: {
        title: 'New issue from smoke test',
        description: 'Created through the visible test suite.',
        status: 'open',
        priority: 'low',
        dueDate: '2025-02-10T09:00:00.000Z',
        assignedTo: 'Jo'
      }
    });

    expect(res.statusCode).toBe(201);
    expect(body).toMatchObject({
      success: true,
      data: {
        title: 'New issue from smoke test'
      }
    });
    await expect(Ticket.countDocuments({ title: 'New issue from smoke test' })).resolves.toBe(1);
  });

  it('rejects invalid post bodies', async () => {
    const { res, body } = await invokeRoute(handler, {
      method: 'POST',
      body: {
        title: '   ',
        description: 'Missing title should fail',
        status: 'open',
        priority: 'medium',
        dueDate: '2025-02-10T09:00:00.000Z'
      }
    });

    expect(res.statusCode).toBe(400);
    expect(body).toMatchObject({
      success: false,
      error: {
        code: 'INVALID_INPUT'
      }
    });
  });
});
