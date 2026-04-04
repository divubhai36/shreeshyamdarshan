import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin@ssd@123', 10);
    const result = await prisma.adminUser.updateMany({
      data: {
        password: hashedPassword,
      },
    });
    console.log(`Password updated successfully! Selected rows: ${result.count}`);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
