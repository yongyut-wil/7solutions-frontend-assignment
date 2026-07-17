import Fastify, { type FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { type ConnectRouter } from '@connectrpc/connect';
import { create } from '@bufbuild/protobuf';
import { fastifyConnectPlugin } from '@connectrpc/connect-fastify';
import { UserGroupService } from './gen/proto/users_pb.js';
import { DepartmentSummarySchema, GetGroupedUsersResponseSchema } from './gen/proto/users_pb.js';
import type { DepartmentSummary, GetGroupedUsersResponse } from './gen/proto/users_pb.js';
import { getGroupedUsers } from './service.js';
import type { GroupedResult } from './types.js';

function groupedResultToResponse(data: GroupedResult): GetGroupedUsersResponse {
  const departments: Record<string, DepartmentSummary> = {};
  for (const [dept, summary] of Object.entries(data)) {
    departments[dept] = create(DepartmentSummarySchema, {
      male: summary.male,
      female: summary.female,
      ageRange: summary.ageRange,
      hair: summary.hair,
      addressUser: summary.addressUser,
    });
  }
  return create(GetGroupedUsersResponseSchema, { departments });
}

export function buildServer(): FastifyInstance {
  const fastify = Fastify({
    logger: { level: process.env.NODE_ENV === 'test' ? 'silent' : 'info' },
  });

  void fastify.register(swagger, {
    openapi: {
      info: { title: 'User API', version: '1.0.0' },
      servers: [{ url: 'http://localhost:4000' }],
    },
  });
  void fastify.register(swaggerUi, { routePrefix: '/docs' });

  fastify.get(
    '/users/grouped',
    {
      schema: {
        description: 'Return users grouped by company department',
        response: {
          200: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                male: { type: 'integer' },
                female: { type: 'integer' },
                ageRange: { type: 'string' },
                hair: { type: 'object', additionalProperties: { type: 'integer' } },
                addressUser: { type: 'object', additionalProperties: { type: 'string' } },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const data = await getGroupedUsers();
      return reply.send(data);
    }
  );

  void fastify.register(fastifyConnectPlugin, {
    routes(router: ConnectRouter) {
      router.service(UserGroupService, {
        async getGroupedUsers() {
          const data = await getGroupedUsers();
          return groupedResultToResponse(data);
        },
      });
    },
  });

  return fastify;
}
