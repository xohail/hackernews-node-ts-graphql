# Hackernews GraphQL API

A Hackernews clone GraphQL API built by following the [GraphQL Yoga Basic Tutorial](https://the-guild.dev/graphql/yoga-server/tutorial/basic).

## Tech Stack

- **Runtime**: Node.js v25.3
- **Language**: TypeScript 5.7
- **GraphQL Server**: graphql-yoga 5
- **ORM**: Prisma 7 with `@prisma/adapter-libsql`
- **Database**: SQLite via `@libsql/client`
- **Script runner**: tsx

## Features

- Query links with filtering (`filterNeedle`) and pagination (`skip`, `take`)
- Create, update, and delete links
- Post comments on links
- Relational data — links have many comments, comments belong to a link
- Input validation with `GraphQLError`

## GraphQL Schema

```graphql
type Query {
  info: String!
  feed(filterNeedle: String, skip: Int, take: Int): [Link!]!
  comment(id: ID!): Comment
}

type Mutation {
  postLink(url: String!, description: String!, author: String): Link!
  deleteLink(id: ID!): Link!
  updateLink(id: ID!, url: String, description: String, author: String): Link!
  postCommentOnLink(linkId: ID!, body: String!): Comment!
}

type Link {
  id: ID!
  url: String!
  description: String!
  author: String
  comments: [Comment!]!
}

type Comment {
  id: ID!
  body: String!
  linkId: Int
  link: Link!
}
```

## Getting Started

**Prerequisites**: Node.js 18+

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the dev server (with hot reload)
npm run dev
```

The server starts at `http://localhost:4000/graphql` with GraphiQL explorer available in the browser.

## Project Structure

```
src/
  main.ts        # Server entry point
  schema.ts      # GraphQL type definitions and resolvers
  context.ts     # Prisma client injected into every resolver
prisma/
  schema.prisma  # Data model
  migrations/    # SQL migration history
```

## Example Queries

**Fetch all links:**
```graphql
query {
  feed {
    id
    url
    description
    author
  }
}
```

**Filter and paginate:**
```graphql
query {
  feed(filterNeedle: "graphql", skip: 0, take: 5) {
    id
    url
    description
  }
}
```

**Post a link:**
```graphql
mutation {
  postLink(url: "https://graphql.org", description: "GraphQL official site") {
    id
    url
  }
}
```

**Post a comment:**
```graphql
mutation {
  postCommentOnLink(linkId: "1", body: "Great resource!") {
    id
    body
  }
}
```