const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    const fields = Object.keys(prisma.wholesaler.fields || {});
    console.log("Wholesaler fields found:", fields);
    
    // Check for phone
    const hasPhone = fields.includes('phone');
    console.log("Has phone field:", hasPhone);

    const testUser = await prisma.wholesaler.findUnique({
      where: { phone: "9999999999" }
    });
    console.log("Test user found by phone:", testUser ? "YES" : "NO");
    if(testUser) console.log("Plain password check:", testUser.plainPassword);

  } catch (e) {
    console.error("Prisma check failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
