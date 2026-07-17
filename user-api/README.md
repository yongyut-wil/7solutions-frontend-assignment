# Create data from API

TypeScript + Fastify service that fetches users from [dummyjson.com](https://dummyjson.com/users), groups them by `company.department`, and exposes the result over REST and ConnectRPC (gRPC-compatible).

## Requirements

From the [7Solutions frontend assignment](https://github.com/7-solutions/frontend-assignment):

- TypeScript + TypeScript modules + HTTP framework.
- Transform JSON from `https://dummyjson.com/users` into a grouped structure.
- Extra points for tests and performance focus.

## Tech Stack

| Library     | Version | Why                                                                             |
| ----------- | ------- | ------------------------------------------------------------------------------- |
| Fastify     | 5.x     | Fast, schema-based serialization and plugin ecosystem.                          |
| TypeScript  | 5.x     | Type-safe modules (ESM).                                                        |
| ConnectRPC  | 2.x     | TS-first RPC that serves gRPC, gRPC-Web, and Connect over the same HTTP routes. |
| Protobuf-ES | 2.x     | Generated schema-driven protobuf types.                                         |
| Vitest      | 4.x     | Fast tests for pure transforms and integration tests.                           |

## Architecture

- `client.ts` fetches `dummyjson.com/users?limit=0&select=...` with `select=` limited to the fields actually used, reducing payload size. It supports retries and an optional `AbortSignal`.
- `transform.ts` is a pure, single-pass `O(n)` function that builds the grouped summary without sorting or re-iterating.
- `service.ts` wraps the fetch + transform in a short-lived in-memory cache (TTL 60s) with promise coalescing, so concurrent requests share the same upstream fetch.
- `server.ts` mounts the REST endpoint and the ConnectRPC service on the same Fastify instance. Both use the shared service, so business logic is not duplicated.

## Performance Notes

- Single-pass grouping keeps CPU at `O(n)` for `n` users.
- `select=` reduces JSON payload from dummyjson.
- Promise coalescing prevents a thundering herd when the cache is empty.
- The cache is in-memory and per-process; a production deployment would replace it with a shared cache (e.g., Redis) or add `stale-while-revalidate` / circuit breaker logic for the upstream.

## Run Locally

```bash
cd user-api
pnpm install
pnpm dev
```

The server listens on `http://localhost:4000`.

## Endpoints

- `GET /users/grouped` — JSON response grouped by department.
- `POST /users.UserGroupService/GetGroupedUsers` — ConnectRPC endpoint (also speaks gRPC and gRPC-Web).
- `GET /docs` — Swagger UI.

## Test

```bash
pnpm test
```

## Example REST response

```bash
curl http://localhost:4000/users/grouped | jq .
```

```json
{
  "Engineering": {
    "male": 10,
    "female": 8,
    "ageRange": "20-65",
    "hair": { "Black": 5, "Blond": 8, "Brown": 5 },
    "addressUser": { "TerryMedhurst": "10001" }
  }
}
```
