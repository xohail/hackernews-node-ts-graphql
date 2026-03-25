# Hackernews GraphQL API — Project Context

## What this project is

A Hackernews clone GraphQL API built with Node.js, TypeScript, GraphQL Yoga, Prisma 7, and SQLite.
The goal is to grow this into a professional portfolio project.

## Tech Stack

- **Runtime**: Node.js v25.3
- **Language**: TypeScript
- **GraphQL Server**: graphql-yoga
- **ORM**: Prisma 7.0.1 (uses `@prisma/adapter-libsql` driver adapter — required in Prisma 7, no built-in engine)
- **Database**: SQLite via `@libsql/client` + `file:./dev.db`
- **Script runner**: tsx

## Key architecture notes

- Prisma client is generated to `src/generated/prisma/` (custom output, NOT node_modules)
- Import Prisma client from `"./generated/prisma"` not `"@prisma/client"`
- `PrismaClient` must be instantiated with a driver adapter: `new PrismaClient({ adapter })`
- Database URL `file:./dev.db` resolves relative to the project root (where tsx is run from)
- Context (`src/context.ts`) holds the Prisma instance and is injected into every resolver
- After any `prisma/schema.prisma` change: run `npx prisma migrate dev` then `npx prisma generate`

## Current data model

```prisma
model Link {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  description String
  url         String
  author      String   @default("")
}
```

## Current GraphQL API

```graphql
type Query {
  info: String!
  feed: [Link!]!
}

type Mutation {
  postLink(url: String!, description: String!, author: String): Link!
  deleteLink(id: ID!): Link!
  updateLink(id: ID!, url: String, description: String, author: String): Link!
}

type Link {
  id: ID!
  url: String!
  description: String!
  author: String
}
```

## Roadmap (resume goal)

### Phase 1 — Complete the Core API

- [ ] Authentication — `User` model, `signup`/`login` mutations, JWT tokens
- [ ] Relations — Link `postedBy` → User (replace `author: String` with a real foreign key)
- [ ] Filtering & Pagination — `feed(filter, skip, take, orderBy)`
- [ ] Voting — `Vote` model, `vote` mutation

### Phase 2 — Production-Grade

- [ ] Input validation
- [ ] Typed error handling with `GraphQLError`
- [ ] DataLoader to avoid N+1 queries
- [ ] Rate limiting
- [ ] `.env.example` and secrets management

### Phase 3 — Tooling & Quality

- [ ] Integration tests with Vitest
- [ ] ESLint + Prettier
- [ ] `graphql-codegen` for auto-generated resolver types
- [ ] Meaningful git history and README

### Phase 4 — Deploy

- [ ] Turso (hosted libsql — already compatible with the current adapter setup)
- [ ] Railway or Render for the server

## Resume description (target)

> GraphQL API built with Node.js, TypeScript, GraphQL Yoga, and Prisma. Features JWT authentication,
> relational data modeling, paginated queries, and DataLoader for query optimization. Deployed on Railway with Turso.
