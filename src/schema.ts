import { createSchema } from "graphql-yoga";
import { Comment, Link, Prisma } from "./generated/prisma";
import type { GraphQLContext } from "./context";
import { GraphQLError } from "graphql/error";

const typeDefs = `
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
`;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (
      parent: unknown,
      args: { filterNeedle?: string; skip?: number; take?: number },
      context: GraphQLContext,
    ) => {
      if (args.take !== undefined && (args.take < 1 || args.take > 5)) {
        throw new GraphQLError("take must be between 1 and 5.");
      }
      const where = args.filterNeedle
        ? {
            OR: [
              { description: { contains: args.filterNeedle } },
              { url: { contains: args.filterNeedle } },
            ],
          }
        : {};
      return context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
      });
    },
    comment: async (
      parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      return context.prisma.comment.findUnique({
        where: {
          id: parseInt(args.id),
        },
      });
    },
  },
  Mutation: {
    postLink: async function (
      parent: unknown,
      args: { description: string; url: string; author?: string },
      context: GraphQLContext,
    ) {
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
          author: args.author,
        },
      });
      return newLink;
    },
    deleteLink: async function (
      parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) {
      const removedLink = await context.prisma.link.delete({
        where: {
          id: parseInt(args.id),
        },
      });
      return removedLink;
    },
    updateLink: async function (
      parent: unknown,
      args: { id: string; url?: string; description?: string; author?: string },
      context: GraphQLContext,
    ) {
      const updatedLink = await context.prisma.link.update({
        where: {
          id: parseInt(args.id),
        },
        data: {
          url: args.url,
          description: args.description,
          author: args.author,
        },
      });
      return updatedLink;
    },
    postCommentOnLink: async function (
      parent: unknown,
      args: { linkId: string; body: string },
      context: GraphQLContext,
    ) {
      const postCommentOnLink = await context.prisma.comment
        .create({
          data: {
            linkId: parseInt(args.linkId),
            body: args.body,
          },
        })
        .catch((err: unknown) => {
          if (err instanceof Prisma.PrismaClientValidationError) {
            return Promise.reject(
              new GraphQLError(
                `Cannot post comment on non-existing link with id '${args.linkId}'.`,
              ),
            );
          }
          return Promise.reject(err);
        });
      return postCommentOnLink;
    },
  },

  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    author: (parent: Link) => parent.author,
    url: (parent: Link) => parent.url,
    comments: (parent: Link, args: {}, context: GraphQLContext) => {
      return context.prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          linkId: parent.id,
        },
      });
    },
  },

  Comment: {
    id: (parent: Comment) => parent.id,
    body: (parent: Comment) => parent.body,
    linkId: (parent: Comment) => parent.linkId,
    link: async (parent: Comment, args: {}, context: GraphQLContext) => {
      return context.prisma.comment.findUnique({
        where: {
          id: parent.linkId,
        },
      });
    },
  },
};

export const schema = createSchema({
  resolvers,
  typeDefs,
});
