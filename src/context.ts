import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

export type GraphQLContext = {
  prisma: PrismaClient;
};

export async function createContext(): Promise<GraphQLContext> {
  return { prisma };
}
