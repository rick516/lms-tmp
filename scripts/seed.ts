import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Math" },
        { name: "Science" },
        { name: "History" },
        { name: "English" },
        { name: "Art" },
        { name: "Music" },
        { name: "PE" },
      ],
    })
    console.log("Seeded categories successfully.");
  } catch (error) {
    console.log("FATAL: " + JSON.stringify(error));
  } finally {
    await db.$disconnect();
  }

}