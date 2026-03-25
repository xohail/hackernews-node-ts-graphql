import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });

// 2
const prisma = new PrismaClient({ adapter });

// 3
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "Fullstack tutorial for GraphQL",
      url: "www.howtographql.com",
      author: "Sohail",
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main().finally(async () => {
  await prisma.$disconnect();
});
