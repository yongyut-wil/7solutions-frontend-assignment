import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import { buildServer } from '../server.js';
import { clearGroupedUsersCache } from '../service.js';
import { UserGroupService } from '../gen/proto/users_pb.js';
import type { User } from '../types.js';

const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Terry',
    lastName: 'Medhurst',
    gender: 'male',
    age: 50,
    hair: { color: 'Black' },
    address: { postalCode: '10001' },
    company: { department: 'Engineering' },
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'female',
    age: 30,
    hair: { color: 'Blond' },
    address: { postalCode: '20002' },
    company: { department: 'Sales' },
  },
];

describe('server', () => {
  beforeEach(() => {
    clearGroupedUsersCache();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ users: mockUsers }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns grouped users via REST', async () => {
    const app = buildServer();
    const response = await app.inject({ method: 'GET', url: '/users/grouped' });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.Engineering).toEqual({
      male: 1,
      female: 0,
      ageRange: '50-50',
      hair: { Black: 1 },
      addressUser: { TerryMedhurst: '10001' },
    });
    expect(body.Sales).toEqual({
      male: 0,
      female: 1,
      ageRange: '30-30',
      hair: { Blond: 1 },
      addressUser: { JaneDoe: '20002' },
    });
  });

  it('returns grouped users via ConnectRPC', async () => {
    const app = buildServer();
    const address = await app.listen({ port: 0 });
    const port = Number(address.split(':').pop());

    const transport = createConnectTransport({
      httpVersion: '1.1',
      baseUrl: `http://127.0.0.1:${port}`,
    });
    const client = createClient(UserGroupService, transport);
    const result = await client.getGroupedUsers({});

    expect(result.departments.Engineering?.male).toBe(1);
    expect(result.departments.Sales?.female).toBe(1);

    await app.close();
  });
});
