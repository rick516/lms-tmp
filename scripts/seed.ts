const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Math" },
        { name: "Computer Science" },
        { name: "Accounting" },
        { name: "Music" },
        { name: "Engineering" },
        { name: "Photography" },
        { name: "Film" },
      ],
    })
    console.log("Seeded categories successfully.");
  } catch (error) {
    console.log(`FATAL: ${JSON.stringify(error)}`);
  } finally {
    await db.$disconnect();
  }
}

main();