const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      emailVerified: new Date(),
    },
  })
  console.log(`Verified ${result.count} existing development users successfully!`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
