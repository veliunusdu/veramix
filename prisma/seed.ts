import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

dotenv.config({ path: require('path').resolve(__dirname, '../.env') })

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('Admin1234!', 10)
  await prisma.user.upsert({ where: { email: 'admin@veramix.com' }, update: {}, create: { email: 'admin@veramix.com', password: hashedPassword, role: 'ADMIN' } })

  console.log('Seed tamamlandi!')
}

main().catch(console.error).finally(() => prisma.$disconnect())