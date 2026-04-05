const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const phone = "9999999999";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const wholesaler = await prisma.wholesaler.upsert({
    where: { phone },
    update: {
      password: hashedPassword,
      plainPassword: password,
      isActive: true,
      name: "Test Wholesaler"
    },
    create: {
      phone,
      password: hashedPassword,
      plainPassword: password,
      name: "Test Wholesaler",
      isActive: true,
    }
  });

  console.log("✅ Test Wholesaler Provisioned:", wholesaler.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
